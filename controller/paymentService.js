// paymentService.js

/**
 * Tạo yêu cầu thanh toán
 * @param {Object} paymentDetails - Thông tin thanh toán
 * @returns {Promise<Object>} - Địa chỉ URL thanh toán VNPay nếu thành công
 */
async function createPayment(paymentDetails) {
    try {
        const response = await fetch('/api/payment/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentDetails)
        });

        if (!response.ok) {
            throw new Error('Không thể tạo yêu cầu thanh toán');
        }

        return await response.json();  // Giả sử trả về { code: '00', data: 'url_to_redirect' }
    } catch (error) {
        console.error('Lỗi khi tạo thanh toán:', error);
        throw error;
    }
}

/**
 * Xử lý kết quả trả về sau thanh toán VNPay
 * @param {string} queryString - Tham số trong URL trả về từ VNPay
 * @returns {Object} - Kết quả thanh toán (success, transactionId, amount, ...)
 */
function processPaymentReturn(queryString) {
    const urlParams = new URLSearchParams(queryString);
    const isSuccess = urlParams.get('vnp_ResponseCode') === '00';  // Kiểm tra mã phản hồi từ VNPay

    return {
        isSuccess,
        transactionId: urlParams.get('vnp_TxnRef'),
        amount: parseInt(urlParams.get('vnp_Amount'), 10) / 100,  // Chuyển đổi từ đồng sang VND
        responseCode: urlParams.get('vnp_ResponseCode'),
        responseMessage: urlParams.get('vnp_Message'),
        paymentTime: urlParams.get('vnp_PayDate'),
        bankCode: urlParams.get('vnp_BankCode')
    };
}

// Export các phương thức để sử dụng từ các module khác
export { createPayment, processPaymentReturn };
