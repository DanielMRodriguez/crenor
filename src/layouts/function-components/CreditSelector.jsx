
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
      5000: 128.05,
      6000: 153.67,
      7000: 179.28,
      8000: 204.89,
      9000: 230.50,
      10000: 256.11,
      11000: 281.72,
      12000: 307.33,
      13000: 332.94,
      14000: 358.55,
      15000: 384.16,
      16000: 409.77,
      17000: 435.39,
      18000: 461.00,
      19000: 486.61,
      20000: 512.22,
      25000: 640.27,
      30000: 768.33,
      35000: 896.38,
      40000: 1024.44,
      45000: 1152.49,
      50000: 1280.55
    },
    mensual: {
      5000: 434.94,
      10000: 869.88,
      15000: 1304.83,
      20000: 1739.77,
      25000: 2174.71,
      30000: 2609.65,
      35000: 3044.60,
      40000: 3479.54,
      45000: 3914.48,
      50000: 4349.42,
      55000: 4784.36,
      60000: 5219.31,
      65000: 5654.25,
      70000: 6089.19,
      75000: 6524.13,
      80000: 6959.07,
      85000: 7394.02,
      90000: 7828.96,
      95000: 8263.90,
      100000: 8698.84
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
  };

  return (
    <div className="credit-selector-container p-8 relative overflow-hidden">
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
