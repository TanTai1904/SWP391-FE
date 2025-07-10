import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "sonner";
import { sendContact } from "../services/contactService";
import styles from "./contact/contact.module.scss";
import contactImg from "../img/contact-illustration.png";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    try {
      await sendContact({
        name: formData.name,
        email: formData.email,
        content: formData.message
      });
      toast.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
      setFormData({ name: "", email: "", message: "" });
      setSuccess(true);
    } catch (err) {
      toast.error("Gửi liên hệ thất bại. Vui lòng thử lại!");
    }
    setIsSubmitting(false);
  };

  return (
    <div className={styles["contact-main"]}>
      <Header />
      <main>
        <div className={styles["contact-hero"]}>
          <div className={styles["hero-content"]}>
            <h1>Liên hệ với chúng tôi</h1>
            <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin để được tư vấn tốt nhất.</p>
          </div>
          <div className={styles["hero-img"]}>
            <img
              src={contactImg}
              alt="Liên hệ minh họa"
              loading="lazy"
            />
          </div>
        </div>
        <div className={styles["contact-grid"]}>
          {/* Contact Information */}
          <div>
            <div className={styles["contact-info-card"]}>
              <div className="info-row">
                <span className="icon"><Mail className="h-5 w-5 text-blue-700 animate-bounce" /></span>
                <div className="info">
                  <div className="label">Email</div>
                  <div className="value"><a href="mailto:hotro@hivcare.vn">hotro@hivcare.vn</a></div>
                </div>
              </div>
              <div className="info-row">
                <span className="icon"><Phone className="h-5 w-5 text-blue-700 animate-pulse" /></span>
                <div className="info">
                  <div className="label">Điện thoại</div>
                  <div className="value"><a href="tel:0123456789">0123 456 789</a></div>
                </div>
              </div>
              <div className="info-row">
                <span className="icon"><MapPin className="h-5 w-5 text-blue-700" /></span>
                <div className="info">
                  <div className="label">Địa chỉ</div>
                  <div className="value">123 Đường Sức Khỏe, Quận 1, TP. Hồ Chí Minh</div>
                </div>
              </div>
            </div>
            <div className={styles["contact-commit-card"]}>
              <div className="commit-title">
                <CheckCircle className="h-6 w-6 text-green-500 animate-pulse" /> Cam kết của chúng tôi
              </div>
              <ul>
                <li>• Phản hồi trong vòng 24 giờ</li>
                <li>• Tư vấn miễn phí và chuyên nghiệp</li>
                <li>• Bảo mật thông tin tuyệt đối</li>
                <li>• Hỗ trợ 24/7 qua các kênh liên hệ</li>
              </ul>
            </div>
          </div>
          {/* Contact Form */}
          <div>
            <form className={styles["contact-form-card"]} onSubmit={handleSubmit} autoComplete="off">
              <div className="form-title">
                <Send className="h-6 w-6 text-blue-600 animate-bounce" /> Gửi tin nhắn
              </div>
              <br />
              <div className={styles["form-group-floating"]}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={styles["floating-input"]}
                  autoComplete="off"
                />
        
                <label htmlFor="name" className={styles["floating-label"]}>Họ và tên *</label>
              </div>
              <div className={styles["form-group-floating"]}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={styles["floating-input"]}
                  autoComplete="off"
                />
                <label htmlFor="email" className={styles["floating-label"]}>Email liên hệ *</label>
              </div>
              <div className={styles["form-group-floating"]}>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  required
                  className={styles["floating-input"]}
                />
                <label htmlFor="message" className={styles["floating-label"]}>Tin nhắn *</label>
              </div>
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles["submit-btn"]}
                >
                  {isSubmitting ? (
                    <>
                      <div className={styles["spinner"]}></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Gửi tin nhắn
                    </>
                
                  )}
                </button>
                {success && (
                  <div className={styles["success-message"]}>
                    <CheckCircle className="text-green-500" /> Đã gửi liên hệ thành công!
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;