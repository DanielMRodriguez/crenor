
import { useState, useEffect } from 'react';

const CreditSelector = () => {
  const [creditAmount, setCreditAmount] = useState(5000);
  const [paymentFrequency, setPaymentFrequency] = useState('semanal');
  const [estimatedPayment, setEstimatedPayment] = useState(200.00);
  const [minAmount, setMinAmount] = useState(5000);
  const [maxAmount, setMaxAmount] = useState(50000);
  const [step, setStep] = useState(1000);
  // Payment calculation data
  const paymentData = {
    semanal: {
      5000: 135.19,
      6000: 162.23,
      7000: 189.27,
      8000: 216.31,
      9000: 243.35,
      10000: 270.39,
      11000: 297.42,
      12000: 324.46,
      13000: 351.50,
      14000: 378.54,
      15000: 405.58,
      16000: 432.62,
      17000: 459.66,
      18000: 486.69,
      19000: 513.73,
      20000: 540.77,
      25000: 675.96,
      30000: 811.16,
      35000: 946.35,
      40000: 1081.54,
      45000: 1216.74,
      50000: 1351.93
    },
    mensual: {
      5000: 585.83,
      10000: 1171.66,
      15000: 1757.49,
      20000: 2343.31,
      25000: 2929.14,
      30000: 3514.97,
      35000: 4100.80,
      40000: 4686.63,
      45000: 5272.46,
      50000: 5858.29,
      55000: 6444.11,
      60000: 7029.94,
      65000: 7615.77,
      70000: 8201.60,
      75000: 8787.43,
      80000: 9373.26,
      85000: 9959.09,
      90000: 10544.91,
      95000: 11130.74,
      100000: 11716.57
    }
  };

  // Calculate payment based on credit amount and frequency
  const calculatePayment = (amount, frequency) => {
    const data = paymentData[frequency];
    if (!data) return 0;

    // Find the closest amount in the data
    const amounts = Object.keys(data).map(Number).sort((a, b) => a - b);
    let closestAmount = amounts[0];
    
    for (let i = 0; i < amounts.length; i++) {
      if (amount >= amounts[i]) {
        closestAmount = amounts[i];
      } else {
        break;
      }
    }
    
    return data[closestAmount] || 0;
  };

  // Update estimated payment when credit amount or frequency changes
  useEffect(() => {
    const payment = calculatePayment(creditAmount, paymentFrequency);
    setEstimatedPayment(payment);
  }, [creditAmount, paymentFrequency]);

  const handleAmountChange = (newAmount) => {
    if(newAmount < minAmount){
      return;
    }
    if(newAmount > maxAmount){
      return;
    }
    
    if(newAmount == 21000 && paymentFrequency === 'semanal'){
        setStep(5000);
        setCreditAmount(25000);
        return;
    }else if(newAmount == 15000 && paymentFrequency === 'semanal' && step == 5000){
        setStep(1000);
        setCreditAmount(19000);
        return;
    }
    setCreditAmount(newAmount);
  };

  const handleFrequencyChange = (frequency) => {
    if(frequency === 'semanal'){
        setStep(1000);
        setMaxAmount(50000);
    }else{
        setStep(5000);
        setMaxAmount(100000);
    }
    setCreditAmount(5000);
    setPaymentFrequency(frequency);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      semanal: 'Pago semanal estimado:',
      mensual: 'Pago mensual estimado:'
    };
    return labels[frequency] || 'Pago estimado:';
  };

  const handleSubmit = () => {
    // Verificar si existe dataLayer de Google Tag Manager
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'creditselectorSubmit',
        creditAmount: creditAmount,
        estimatedPayment: estimatedPayment,
        paymentFrequency: paymentFrequency
      });
    }

    // scroll to formulario #formulario
    let frecuencyPayment = paymentFrequency === 'semanal' ? 'semanal' : 'mensual';
    let amountLoan = creditAmount;
    let url = `https://wa.me/526147871134?text=Hola, me interesa un crédito de ${amountLoan} pesos con pago ${frecuencyPayment}`;
    window.open(url, '_blank');
  };

  return (
    <div className="credit-selector-container p-2 lg:p-8 relative overflow-hidden">
      {/* Main card */}
      <div className="relative bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto">
        {/* Credit Amount Section */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => handleAmountChange(Math.max(step, creditAmount - step))}
              className="w-6 h-6 rounded-full border-2 border-green-800 flex items-center justify-center hover:bg-green-50 transition-colors"
            >
              <span className="text-green-800 font-bold text-lg">−</span>
            </button>
            
            <div className="mx-6">
              <div className="text-4xl font-bold text-green-800">
                {formatCurrency(creditAmount)}
              </div>
            </div>
            
            <button
              onClick={() => handleAmountChange(Math.min(maxAmount, creditAmount + step))}
              className="w-6 h-6 rounded-full border-2 border-green-800 flex items-center justify-center hover:bg-green-50 transition-colors"
            >
              <span className="text-green-800 font-bold text-lg">+</span>
            </button>
          </div>

          {/* Slider */}
          <div className="relative">
            <input
              type="range"
              min={minAmount}
              max={maxAmount}
              step={step}
              value={creditAmount}
              onChange={(e) => handleAmountChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #065f46 0%, #065f46 ${((creditAmount-minAmount)/(maxAmount-minAmount))*100}%, #e5e7eb ${((creditAmount-minAmount)/(maxAmount-minAmount))*100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>

        {/* Payment Frequency Toggle */}
        <div className="mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['semanal', 'mensual'].map((frequency) => (
              <button
                key={frequency}
                onClick={() => handleFrequencyChange(frequency)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  paymentFrequency === frequency
                    ? 'bg-green-800 text-white'
                    : 'text-gray-600 hover:text-green-800'
                }`}
              >
                {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Estimated Payment Display */}
        <div className="bg-green-100 rounded-xl p-4 mb-6 text-center">
          <div className="text-green-800">
            <div className="text-sm font-medium mb-1">
              {getFrequencyLabel(paymentFrequency)}
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(estimatedPayment)}
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <button 
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition-colors"
        >
          ¡Solicítalo ahora!
        </button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          background: #065f46;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          background: #065f46;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default CreditSelector;
