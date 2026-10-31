export default function ContactMap() {
  return (
    <section className="w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.060360274028!2d106.62606661474933!3d10.806689092300438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752be27d8b4f4d%3A0x92dcba2950430867!2zMTQwIEzDqiBUcuG7jW5nIFThuqVuLCBUw6J5IFRo4bqhbmgsIFTDom4gUGjDuiwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1684000000000!5m2!1sen!2s"
        className="w-full h-[400px] md:h-[450px] border-0 block"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Bản đồ Hoàng Bảo Cosmetics"
      />
    </section>
  );
}

export { ContactMap };
