import biaLogin from '@/assets/biaLogin.jpg';

// Banner 1 hinh anh goc ben nua trai man hinh
export default function AuthBanner() {
  return (
    <div className="hidden lg:block lg:w-1/2 relative h-full overflow-hidden bg-rose-50">
      <img
        src={biaLogin}
        alt="Hoàng Bảo Cosmetics Beauty Banner"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
