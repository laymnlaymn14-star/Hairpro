import React, { useState } from 'react';
import { Download, Check, Share2, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  const handleClick = async () => {
    if (isInstalled) return;

    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  if (isInstalled) {
    return (
      <div 
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F5E6EA] border border-[#EAC2CD] text-[#7A3E4E] text-xs font-medium select-none"
        title="تطبيق ELORIA مثبت على جهازك"
      >
        <Check className="w-3.5 h-3.5 text-[#A84C62]" />
        <span className={compact ? 'hidden sm:inline text-[11px]' : 'text-[11px]'}>
          تم تثبيت ELORIA
        </span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#FFF0F4] to-[#FCE8ED] border border-[#F2CCD6] hover:from-[#FCE8ED] hover:to-[#F9D6DF] text-[#632938] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
        title="تثبيت ELORIA كتطبيق على جهازك"
      >
        <Download className="w-3.5 h-3.5 text-[#C86A80]" />
        <span className={compact ? 'hidden sm:inline' : ''}>تثبيت ELORIA</span>
      </button>

      {/* Elegant Fallback Guide Modal when native prompt is not directly callable */}
      {showGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setShowGuide(false)}
        >
          <div 
            className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#FFFDFE] to-[#FFF5F7] p-5 shadow-2xl border border-[#F2CCD6] text-right"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-[#F2CBD4] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#FCE8ED] text-[#A84C62] flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#3D1E26]">تثبيت تطبيق ELORIA</h3>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-md text-[#8C4A5A] hover:bg-[#FCE8ED] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5E2534] leading-relaxed mb-3">
              استمتعي بتجربة قراءة سلسة وسريعة تعمل بدون إنترنت عند تثبيت ELORIA على شاشتكِ الرئيسية:
            </p>

            {isIOS ? (
              <div className="space-y-2 text-xs text-[#42232B] bg-[#FFF0F4] p-3 rounded-xl border border-[#F2CCD6]">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D88A9C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>انقري على زر <strong>المشاركة (Share)</strong> <Share2 className="inline w-3.5 h-3.5 text-[#C86A80]" /> في شريط متصفح Safari.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D88A9C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>مرري لأسفل واختاري <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</strong>.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-[#42232B] bg-[#FFF0F4] p-3 rounded-xl border border-[#F2CCD6]">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D88A9C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>افتحي قائمة المتصفح بالضغط على النقاط الثلاث <strong>(⋮ أو ⋯)</strong> بأعلى أو أسفل الشاشة.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#D88A9C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>اختاري <strong>"تثبيت التطبيق" (Install App)</strong> أو "إضافة إلى الشاشة الرئيسية".</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D88A9C] to-[#C87386] text-white text-xs font-bold shadow-xs hover:opacity-95 cursor-pointer"
            >
              فهمت، حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
