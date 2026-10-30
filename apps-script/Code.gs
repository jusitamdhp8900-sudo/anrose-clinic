// Anrose Clinic – nhận đăng ký tư vấn từ website và gửi về Gmail.
// Dán toàn bộ file này vào Google Apps Script (xem README, mục "Nhận đăng ký tư vấn qua Gmail").

// Gmail nhận thông báo mỗi khi có khách đăng ký. Có thể ghi nhiều địa chỉ, cách nhau bằng dấu phẩy.
const NOTIFY_EMAIL = 'jusitamdhp8900@gmail.com';

// Website gửi đăng ký vào đây.
function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    return reply(sendBooking(data));
  } catch (err) {
    return reply({ success: false, message: String(err) });
  }
}

// Mở link Web app trên trình duyệt sẽ thấy dòng này: dùng để kiểm tra script đang chạy.
function doGet() {
  return reply({ success: true, message: 'Anrose booking đang hoạt động' });
}

// Chạy hàm này một lần trong trình soạn thảo để cấp quyền gửi email và nhận một email mẫu.
function testSend() {
  Logger.log(sendBooking({ name: 'Khách thử nghiệm', phone: '0900 000 000', service: 'Chăm sóc da', when: 'Buổi sáng', note: 'Email thử từ Apps Script' }));
}

function sendBooking(data) {
  // Ô ẩn chỉ bot mới điền: bỏ qua nhưng vẫn báo thành công.
  if (data._honey) return { success: true };
  const name = clean(data.name, 100);
  const phone = clean(data.phone, 24);
  if (name.length < 2 || phone.replace(/\D/g, '').length < 9) {
    return { success: false, message: 'Thiếu họ tên hoặc số điện thoại hợp lệ' };
  }
  const rows = [
    ['Họ và tên', name],
    ['Số điện thoại', phone],
    ['Dịch vụ quan tâm', clean(data.service, 120) || '—'],
    ['Thời gian mong muốn', clean(data.when, 80) || 'Linh hoạt'],
    ['Ghi chú', clean(data.note, 500) || '—'],
    ['Thời điểm gửi', Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'HH:mm dd/MM/yyyy')]
  ];
  const tel = phone.replace(/[^\d+]/g, '');
  const htmlRows = rows.map(function (row) {
    const value = row[0] === 'Số điện thoại'
      ? '<a href="tel:' + tel + '" style="color:#9B621C;font-weight:600">' + escapeHtml(row[1]) + '</a>'
      : escapeHtml(row[1]).replace(/\n/g, '<br>');
    return '<tr><td style="padding:10px 14px;border-bottom:1px solid #eee3d3;color:#7a6f64;white-space:nowrap">' + row[0] +
      '</td><td style="padding:10px 14px;border-bottom:1px solid #eee3d3;color:#2f2721">' + value + '</td></tr>';
  }).join('');
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'Đăng ký tư vấn mới: ' + name + ' – ' + phone,
    name: 'Website Anrose Clinic',
    body: rows.map(function (row) { return row[0] + ': ' + row[1]; }).join('\n'),
    htmlBody: '<div style="font-family:Arial,sans-serif;font-size:15px">' +
      '<p style="color:#9B621C;font-size:17px;margin:0 0 12px">Có khách vừa đăng ký tư vấn trên website Anrose Clinic</p>' +
      '<table style="border-collapse:collapse;background:#fffdf9;border:1px solid #eee3d3">' + htmlRows + '</table>' +
      '<p style="color:#7a6f64;font-size:13px;margin:14px 0 0">Bấm vào số điện thoại để gọi lại cho khách.</p></div>'
  });
  return { success: true };
}

function clean(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function reply(result) {
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}
