const PaymentDoughnutChart = () => {
  return (
    <div className="payment-chart" role="img" aria-label="Payment collection overview">
      <div className="payment-doughnut">
        <strong>34K</strong>
        <span>Collected</span>
      </div>
      <div className="payment-legend">
        <span><i className="payment-dot january" />Jan - Rs. 5,000</span>
        <span><i className="payment-dot february" />Feb - Rs. 4,000</span>
        <span><i className="payment-dot march" />Mar - Rs. 6,000</span>
        <span><i className="payment-dot april" />Apr - Rs. 5,500</span>
        <span><i className="payment-dot may" />May - Rs. 7,000</span>
        <span><i className="payment-dot june" />Jun - Rs. 6,500</span>
      </div>
    </div>
  );
};
export default PaymentDoughnutChart;