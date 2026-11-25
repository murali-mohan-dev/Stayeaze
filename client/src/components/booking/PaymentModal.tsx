import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { CreditCard, QrCode, Banknote, ShieldCheck, CheckCircle2, Lock, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaymentModalProps {
  totalAmount: number;
  onConfirmPayment: (paymentMethod: string) => Promise<void>;
  loading: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  totalAmount,
  onConfirmPayment,
  loading,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'CREDIT_CARD' | 'UPI' | 'DEBIT_CARD' | 'PAY_AT_HOTEL'>('UPI');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [upiId, setUpiId] = useState('stayease.guest@okhdfcbank');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmPayment(selectedMethod);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EBE3D5] shadow-lg space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B132B]">
            Simulated Safe Payment Gateway
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            College Mini-Project Simulated Gateway. No actual debit occurs.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted</span>
        </div>
      </div>

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setSelectedMethod('UPI')}
          className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedMethod === 'UPI'
              ? 'bg-[#0B132B] text-white border-[#C5A059] shadow-md'
              : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
          }`}
        >
          <Smartphone className={`w-5 h-5 ${selectedMethod === 'UPI' ? 'text-[#C5A059]' : 'text-stone-500'}`} />
          <span className="text-xs font-bold">UPI / QR</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod('CREDIT_CARD')}
          className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedMethod === 'CREDIT_CARD'
              ? 'bg-[#0B132B] text-white border-[#C5A059] shadow-md'
              : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
          }`}
        >
          <CreditCard className={`w-5 h-5 ${selectedMethod === 'CREDIT_CARD' ? 'text-[#C5A059]' : 'text-stone-500'}`} />
          <span className="text-xs font-bold">Credit Card</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod('DEBIT_CARD')}
          className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedMethod === 'DEBIT_CARD'
              ? 'bg-[#0B132B] text-white border-[#C5A059] shadow-md'
              : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
          }`}
        >
          <CreditCard className={`w-5 h-5 ${selectedMethod === 'DEBIT_CARD' ? 'text-[#C5A059]' : 'text-stone-500'}`} />
          <span className="text-xs font-bold">Debit Card</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedMethod('PAY_AT_HOTEL')}
          className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
            selectedMethod === 'PAY_AT_HOTEL'
              ? 'bg-[#0B132B] text-white border-[#C5A059] shadow-md'
              : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-stone-400'
          }`}
        >
          <Banknote className={`w-5 h-5 ${selectedMethod === 'PAY_AT_HOTEL' ? 'text-[#C5A059]' : 'text-stone-500'}`} />
          <span className="text-xs font-bold">Pay At Hotel</span>
        </button>
      </div>

      {/* Selected Payment Method Sub-Panel */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {selectedMethod === 'UPI' && (
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D5] space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Simulated QR Code */}
              <div className="w-28 h-28 bg-white p-2 rounded-xl border border-stone-300 shadow-sm flex flex-col items-center justify-center shrink-0">
                <QrCode className="w-20 h-20 text-[#0B132B]" />
                <span className="text-[9px] font-bold text-stone-500">Scan via GPay/PhonePe</span>
              </div>
              <div className="space-y-2 flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Or Pay using Virtual Payment Address (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@okhdfcbank"
                  className="w-full p-2.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
                />
                <p className="text-[11px] text-stone-500">
                  Supported: Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay.
                </p>
              </div>
            </div>
          </div>
        )}

        {(selectedMethod === 'CREDIT_CARD' || selectedMethod === 'DEBIT_CARD') && (
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D5] space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Card Number (Simulated)
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                  CVV / Security Code
                </label>
                <input
                  type="text"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-stone-300 text-xs font-mono font-bold text-[#0B132B] focus:outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'PAY_AT_HOTEL' && (
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EBE3D5] space-y-2">
            <h5 className="font-bold text-sm text-[#0B132B]">Pay Upon Arrival</h5>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your room reservation is held and confirmed instantly. You can settle the bill of <strong>{formatCurrency(totalAmount)}</strong> via Cash, UPI, or Card directly at the hotel front desk during check-in.
            </p>
          </div>
        )}

        {/* Submit simulated payment */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#B38F24] hover:to-[#C5A059] text-[#0B132B] font-extrabold text-base shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-[#0B132B] border-t-transparent rounded-full animate-spin" />
              <span>Authorizing Simulated Transaction...</span>
            </div>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 text-[#0B132B]" />
              <span>
                {selectedMethod === 'PAY_AT_HOTEL'
                  ? `Confirm Reservation (${formatCurrency(totalAmount)})`
                  : `Pay & Confirm ${formatCurrency(totalAmount)}`}
              </span>
            </>
          )}
        </button>

        <p className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>PCI-DSS Simulated Compliant • Immediate Confirmation Receipt Generated</span>
        </p>
      </form>

    </div>
  );
};
