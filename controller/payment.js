import paymentService from './paymentService.js';

/**
 * Hàm khởi tạo quá trình thanh toán
 * @param {number} orderId - ID của đơn hàng
 * @param {number} amount - Số tiền cần thanh toán (đơn vị VND)
 */
async function initiatePayment(orderId, amount) {
  try {
    // Chuẩn bị thông tin thanh toán
    const paymentDetails = {
      amount: amount, // Số tiền (VND)
      orderInfo: `Thanh toan don hang: ${orderId}`,
      orderType: 'other', // Loại hàng hóa: other, fashion, electronics, furniture...
      bankCode: 'NCB', // Mã ngân hàng (để trống để hiển thị tất cả)
      language: 'vn', // Ngôn ngữ (vn/en)
      returnUrl: `${window.location.origin}/restaurant/payment/return` // URL nhận kết quả trả về
    };

    // Gọi service để tạo yêu cầu thanh toán
    const response = await paymentService.createPayment(paymentDetails);
    
    // Kiểm tra kết quả
    if (response && response.code === '00') {
      // Chuyển hướng đến trang thanh toán VNPay
      window.location.href = response.data;
    } else {
      // Xử lý lỗi
      console.error('Không thể tạo yêu cầu thanh toán:', response.message);
      alert(`Lỗi thanh toán: ${response.message}`);
    }
  } catch (error) {
    console.error('Lỗi khi khởi tạo thanh toán:', error);
    alert('Có lỗi xảy ra khi tạo yêu cầu thanh toán. Vui lòng thử lại sau.');
  }
}

/**
 * Hàm xử lý kết quả trả về sau khi thanh toán VNPay
 */
function handlePaymentReturn() {
  try {
    // Lấy tham số URL từ trang hiện tại
    const queryString = window.location.search;
    
    // Xử lý kết quả thanh toán
    const paymentResult = paymentService.processPaymentReturn(queryString);
    
    // Hiển thị kết quả
    if (paymentResult.isSuccess) {
      // Thanh toán thành công
      showPaymentSuccess(paymentResult);
      
      // Gửi thông tin đến server để cập nhật trạng thái đơn hàng
      updateOrderStatus(paymentResult);
    } else {
      // Thanh toán thất bại
      showPaymentFailure(paymentResult);
    }
  } catch (error) {
    console.error('Lỗi khi xử lý kết quả thanh toán:', error);
    alert('Có lỗi xảy ra khi xử lý kết quả thanh toán.');
  }
}

/**
 * Hiển thị thông báo thanh toán thành công
 * @param {Object} paymentResult - Kết quả thanh toán
 */
function showPaymentSuccess(paymentResult) {
  const successMessage = `Thanh toán thành công! Mã giao dịch: ${paymentResult.transactionId}`;
  document.getElementById('payment-result-container').innerHTML = successMessage;
}

/**
 * Hiển thị thông báo thanh toán thất bại
 * @param {Object} paymentResult - Kết quả thanh toán
 */
function showPaymentFailure(paymentResult) {
  const failureMessage = `Thanh toán không thành công. Lý do: ${paymentResult.responseMessage}`;
  document.getElementById('payment-result-container').innerHTML = failureMessage;
}

/**
 * Gửi thông tin cập nhật trạng thái đơn hàng đến server
 * @param {Object} paymentResult - Kết quả thanh toán
 */
async function updateOrderStatus(paymentResult) {
  try {
    const response = await fetch('/api/orders/update-payment-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: paymentResult.transactionId,
        paymentStatus: 'PAID',
        paymentDetails: paymentResult
      })
    });
    
    if (!response.ok) {
      console.error('Không thể cập nhật trạng thái đơn hàng');
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
  }
}

/**
 * Thử lại thanh toán
 * @param {string} orderId - ID của đơn hàng
 */
function retryPayment(orderId) {
  // Lấy thông tin đơn hàng và số tiền từ server
  fetch(`/api/orders/${orderId}`)
    .then(response => response.json())
    .then(orderData => {
      initiatePayment(orderId, orderData.totalAmount);
    })
    .catch(error => {
      console.error('Không thể lấy thông tin đơn hàng:', error);
      alert('Có lỗi xảy ra khi thử lại thanh toán. Vui lòng thử lại sau.');
    });
}

/**
 * Chuyển về trang chủ
 */
function redirectToHome() {
  window.location.href = '/restaurant';
}

// Kiểm tra xem trang hiện tại có phải là trang kết quả thanh toán hay không
if (window.location.pathname.includes('/payment/return')) {
  // Xử lý kết quả thanh toán
  document.addEventListener('DOMContentLoaded', handlePaymentReturn);
}

export { initiatePayment, handlePaymentReturn };
