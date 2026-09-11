'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, Loader2, CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import {
  initiateJazzCashPayment,
  initiateEasyPaisaPayment,
  confirmJazzCashPayment,
  confirmEasyPaisaPayment,
  recordCardPayment,
  UserBooking,
} from '@/services/userBookingsService';

type Method = 'jazzcash' | 'easypaisa' | 'card';
type Step = 'form' | 'processing' | 'success' | 'error';

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(val: string) {
  const d = val.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
function luhnValid(num: string): boolean {
  const digits = num.replace(/\s/g, '');
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}
function cardBrand(num: string): 'visa' | 'mastercard' | 'amex' | null {
  const d = num.replace(/\s/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^5[1-5]/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  return null;
}

const METHOD_CONFIG: Record<Method, { label: string; color: string; bg: string; border: string; textColor: string }> = {
  jazzcash:  { label: 'JazzCash',   color: 'bg-red-600',     bg: 'bg-red-50',    border: 'border-red-200',   textColor: 'text-red-700' },
  easypaisa: { label: 'EasyPaisa',  color: 'bg-emerald-600', bg: 'bg-emerald-50',border: 'border-emerald-200',textColor: 'text-emerald-700' },
  card:      { label: 'Debit / Credit Card', color: 'bg-[#0b3327]', bg: 'bg-gray-50', border: 'border-gray-200', textColor: 'text-gray-700' },
};

interface Props {
  booking: UserBooking;
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
}

export const AdvancePaymentModal: React.FC<Props> = ({ booking, onClose, onSuccess }) => {
  const [method, setMethod] = useState<Method>('jazzcash');
  const [step, setStep] = useState<Step>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [processingLabel, setProcessingLabel] = useState('');

  // Mobile wallet fields
  const [phone, setPhone] = useState('');

  // Card fields
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});

  const amount = booking.advanceAmount;
  const cfg = METHOD_CONFIG[method];

  const validateCard = () => {
    const errs: Record<string, string> = {};
    if (!cardName.trim()) errs.cardName = 'Cardholder name is required.';
    if (!luhnValid(cardNum)) errs.cardNum = 'Invalid card number.';
    const [mm, yy] = expiry.split('/');
    const now = new Date();
    const exMonth = parseInt(mm, 10);
    const exYear = 2000 + parseInt(yy ?? '0', 10);
    if (!mm || !yy || exMonth < 1 || exMonth > 12 || exYear < now.getFullYear() || (exYear === now.getFullYear() && exMonth < now.getMonth() + 1)) {
      errs.expiry = 'Invalid or expired card.';
    }
    if (cvv.length < 3) errs.cvv = 'CVV must be 3–4 digits.';
    return errs;
  };

  const handleMobileWalletPay = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setErrorMsg('Enter a valid Pakistani mobile number.');
      return;
    }
    setErrorMsg('');
    setStep('processing');

    try {
      setProcessingLabel(`Initiating ${cfg.label} payment…`);
      const init = method === 'jazzcash'
        ? await initiateJazzCashPayment(booking.id)
        : await initiateEasyPaisaPayment(booking.id);

      setProcessingLabel(`Connecting to ${cfg.label} gateway…`);
      await sleep(1400);

      setProcessingLabel('Verifying payment…');
      if (method === 'jazzcash') {
        await confirmJazzCashPayment(booking.id, init.transactionReference, init.amount);
      } else {
        await confirmEasyPaisaPayment(booking.id, init.transactionReference, init.amount);
      }

      await sleep(600);
      setStep('success');
      onSuccess(booking.id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setStep('error');
    }
  };

  const handleCardPay = async () => {
    const errs = validateCard();
    setCardErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setErrorMsg('');
    setStep('processing');
    setProcessingLabel('Processing card payment…');

    try {
      await sleep(1800);
      const txRef = `CARD-${cardNum.replace(/\s/g, '').slice(-4)}-${Date.now()}`;
      await recordCardPayment(booking.id, amount, txRef);
      setStep('success');
      onSuccess(booking.id);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setStep('error');
    }
  };

  const brand = cardBrand(cardNum);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-gray-900">Pay Advance</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{booking.groundName ?? 'Ground Booking'}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">

          {/* Amount banner */}
          <div className="mx-6 mt-5 p-4 bg-[#0b3327]/5 rounded-xl border border-[#0b3327]/10 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 font-medium">Advance Due</p>
              <p className="text-2xl font-black text-[#0b3327]">PKR {amount.toLocaleString()}</p>
            </div>
            <div className="text-right text-[11px] text-gray-500">
              <p>Total: <span className="font-bold text-gray-700">PKR {booking.totalAmount.toLocaleString()}</span></p>
              <p>Remaining after: <span className="font-bold text-gray-700">PKR {(booking.totalAmount - amount).toLocaleString()}</span></p>
            </div>
          </div>

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-12 px-6 space-y-4">
              <div className={`w-14 h-14 rounded-full ${cfg.color} flex items-center justify-center`}>
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              </div>
              <p className="text-sm font-bold text-gray-800">{processingLabel}</p>
              <p className="text-xs text-gray-400 text-center">Please wait. Do not close or refresh the page.</p>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-12 px-6 space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-extrabold text-gray-900">Payment Successful!</p>
                <p className="text-xs text-gray-500 mt-1">Your booking has been confirmed. The ground owner has been notified.</p>
              </div>
              <div className="w-full p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium">
                PKR {amount.toLocaleString()} paid via {cfg.label}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[#0b3327] text-white text-xs font-bold rounded-xl hover:bg-[#06241b] cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

          {/* Step: Error */}
          {step === 'error' && (
            <div className="mx-6 my-4 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-700">Payment Failed</p>
                <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
                <button type="button" onClick={() => setStep('form')} className="mt-2 text-xs font-bold text-red-700 underline cursor-pointer">
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Step: Form */}
          {step === 'form' && (
            <div className="px-6 py-5 space-y-5">

              {/* Method tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-gray-100 rounded-xl">
                {(Object.keys(METHOD_CONFIG) as Method[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMethod(m); setErrorMsg(''); setCardErrors({}); }}
                    className={`py-2 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      method === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {m === 'card' ? 'Card' : METHOD_CONFIG[m].label}
                  </button>
                ))}
              </div>

              {/* JazzCash */}
              {method === 'jazzcash' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-red-800">JazzCash</p>
                      <p className="text-[11px] text-red-600">Pay instantly via your JazzCash wallet</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">JazzCash Mobile Number</label>
                    <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-red-400/30 focus-within:border-red-400">
                      <span className="px-3.5 py-2.5 bg-gray-50 text-xs font-bold text-gray-500 border-r border-gray-200">+92</span>
                      <input
                        type="tel"
                        maxLength={11}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="3XX XXXXXXX"
                        className="flex-1 px-3.5 py-2.5 text-xs focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                  {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}
                  <button
                    type="button"
                    onClick={handleMobileWalletPay}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Pay PKR {amount.toLocaleString()} via JazzCash
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">Sandbox mode — payment is simulated for testing.</p>
                </div>
              )}

              {/* EasyPaisa */}
              {method === 'easypaisa' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-emerald-800">EasyPaisa</p>
                      <p className="text-[11px] text-emerald-600">Pay instantly via your EasyPaisa account</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">EasyPaisa Mobile Number</label>
                    <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-emerald-400/30 focus-within:border-emerald-500">
                      <span className="px-3.5 py-2.5 bg-gray-50 text-xs font-bold text-gray-500 border-r border-gray-200">+92</span>
                      <input
                        type="tel"
                        maxLength={11}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="3XX XXXXXXX"
                        className="flex-1 px-3.5 py-2.5 text-xs focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                  {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}
                  <button
                    type="button"
                    onClick={handleMobileWalletPay}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Pay PKR {amount.toLocaleString()} via EasyPaisa
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">Sandbox mode — payment is simulated for testing.</p>
                </div>
              )}

              {/* Card */}
              {method === 'card' && (
                <div className="space-y-4">
                  {/* Card preview */}
                  <div className="h-32 rounded-xl bg-gradient-to-br from-[#0b3327] to-[#1a5c45] p-4 flex flex-col justify-between text-white shadow-lg">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-medium opacity-60">CARD NUMBER</p>
                        <p className="text-xs font-mono tracking-widest font-bold">
                          {cardNum || '•••• •••• •••• ••••'}
                        </p>
                      </div>
                      {brand === 'visa' && <span className="text-xs font-extrabold italic tracking-tight">VISA</span>}
                      {brand === 'mastercard' && (
                        <div className="flex gap-[-4px]">
                          <div className="w-5 h-5 rounded-full bg-red-500 opacity-90" />
                          <div className="w-5 h-5 rounded-full bg-yellow-400 opacity-90 -ml-2" />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[9px] opacity-60">CARDHOLDER</p>
                        <p className="text-xs font-bold uppercase tracking-wide">{cardName || 'YOUR NAME'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] opacity-60">EXPIRES</p>
                        <p className="text-xs font-bold">{expiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={19}
                        value={cardNum}
                        onChange={(e) => setCardNum(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#0b3327]/20 focus:border-[#0b3327] ${cardErrors.cardNum ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                    </div>
                    {cardErrors.cardNum && <p className="text-[11px] text-red-600">{cardErrors.cardNum}</p>}
                  </div>

                  {/* Cardholder name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Name on Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      placeholder="JOHN DOE"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-[#0b3327]/20 focus:border-[#0b3327] ${cardErrors.cardName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                    />
                    {cardErrors.cardName && <p className="text-[11px] text-red-600">{cardErrors.cardName}</p>}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">Expiry Date</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b3327]/20 focus:border-[#0b3327] ${cardErrors.expiry ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {cardErrors.expiry && <p className="text-[11px] text-red-600">{cardErrors.expiry}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700">CVV</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        placeholder="•••"
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#0b3327]/20 focus:border-[#0b3327] ${cardErrors.cvv ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                      />
                      {cardErrors.cvv && <p className="text-[11px] text-red-600">{cardErrors.cvv}</p>}
                    </div>
                  </div>

                  {errorMsg && <p className="text-xs text-red-600 font-medium">{errorMsg}</p>}

                  <button
                    type="button"
                    onClick={handleCardPay}
                    className="w-full py-3 bg-[#0b3327] hover:bg-[#06241b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Pay PKR {amount.toLocaleString()}
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">Test mode — no real charge will be made.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
