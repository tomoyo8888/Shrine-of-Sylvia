import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const offerings = [
  { id: "flowers", icon: "💐", name: "Bó hoa", detail: "Một bó hoa tươi được dâng lên", kind: "kind" },
  { id: "horns", icon: "🦌", name: "Sừng động vật", detail: "Một cặp sừng được đặt trước bệ thờ", kind: "kind" },
  { id: "handmade", icon: "🧶", name: "Đồ handmade", detail: "Món quà nhỏ do chính tay tín đồ làm", kind: "kind" },
  { id: "plants", icon: "🌿", name: "Cây cỏ", detail: "Một nhành cây xanh từ khu vườn", kind: "kind" },
  { id: "human", icon: "🧍", name: "Người sống", detail: "Một sinh mạng bị đem ra làm vật tế", kind: "human" },
];

const tarotDeck = [
  { name: "The Fool", vi: "Kẻ Khờ", symbol: "🃏", meaning: "Một khởi đầu đang chờ đợi. Hãy bước tới, nhưng đừng nhầm sự liều lĩnh với lòng can đảm.", upright: true },
  { name: "The Magician", vi: "Nhà Ảo Thuật", symbol: "✧", meaning: "Những gì cần thiết đã nằm trong tay ngươi. Ý chí và hành động sẽ biến khả năng thành hiện thực.", upright: true },
  { name: "The Empress", vi: "Hoàng Hậu", symbol: "♛", meaning: "Sự sống đang âm thầm sinh sôi. Hãy nuôi dưỡng điều ngươi muốn bảo vệ, thay vì cố ép nó lớn lên.", upright: true },
  { name: "The Hermit", vi: "Ẩn Sĩ", symbol: "🏮", meaning: "Lùi lại một bước để lắng nghe chính mình. Không phải câu trả lời nào cũng đến từ bên ngoài.", upright: true },
  { name: "Wheel of Fortune", vi: "Bánh Xe Số Phận", symbol: "☸", meaning: "Một chu kỳ đang đổi chiều. Điều tưởng như kết thúc có thể chỉ là một hình thái khác của khởi đầu.", upright: true },
  { name: "Death", vi: "Cái Chết", symbol: "☠", meaning: "Đừng vội sợ hãi. Lá bài này nói về sự chuyển hóa: thứ đã mục ruỗng cần được nhường chỗ cho mầm sống mới.", upright: true },
  { name: "The Star", vi: "Ngôi Sao", symbol: "✴", meaning: "Hy vọng chưa biến mất. Hãy kiên nhẫn với bản thân; chữa lành cũng là một dạng sinh trưởng.", upright: true },
  { name: "The Moon", vi: "Mặt Trăng", symbol: "☾", meaning: "Có điều gì đó đang bị che khuất. Đừng đưa ra quyết định chỉ vì nỗi sợ đang nói quá lớn.", upright: true },
  { name: "The Tower", vi: "Tòa Tháp", symbol: "⚡", meaning: "Một cấu trúc không còn vững chắc sẽ sụp đổ. Đau đớn, nhưng sự thật có thể giải phóng ngươi.", upright: true },
  { name: "The Sun", vi: "Mặt Trời", symbol: "☼", meaning: "Sự sáng tỏ và niềm vui đang đến gần. Hãy cho phép mình đón nhận những điều tốt đẹp.", upright: true },
  { name: "The World", vi: "Thế Giới", symbol: "◎", meaning: "Một hành trình đã đi đến điểm trọn vẹn. Ngươi đã thay đổi nhiều hơn những gì bản thân nhận ra.", upright: true },
  { name: "The Hanged One", vi: "Người Treo Ngược", symbol: "♧", meaning: "Có lẽ ngươi cần nhìn vấn đề từ một góc độ khác. Tạm dừng không đồng nghĩa với thất bại.", upright: true }
];

const chatReplies = [
  "Ngươi tìm đến ta vì tò mò, hay vì có điều gì đang đè nặng trong lòng?",
  "Nhân loại luôn hỏi về ý nghĩa của sự sống, nhưng lại hiếm khi chịu ngồi xuống và quan sát nó.",
  "Một hạt mầm không cần biết cả khu rừng sẽ trông như thế nào. Nó chỉ cần bắt đầu mọc rễ.",
  "Ta đã chứng kiến vô số mùa tàn lụi. Đừng xem kết thúc là điều đối nghịch với sự sống.",
  "Nói tiếp đi. Ta đang lắng nghe — dù không phải lời nào của ngươi cũng đáng được hồi đáp.",
  "Ngươi mong ta ban phước, hay chỉ muốn có ai đó nghe thấy lời mình?"
];

function App() {
  const [tab, setTab] = useState("sanctuary");
  const [offering, setOffering] = useState(null);
  const [offeringResult, setOfferingResult] = useState(null);
  const [storm, setStorm] = useState(false);
  const [prayer, setPrayer] = useState("");
  const [reading, setReading] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "sylvia", text: "Ngươi đã bước vào thánh điện. Hãy nói điều ngươi muốn nói, hoặc cứ im lặng nếu đó là điều ngươi cần." }
  ]);
  const [favor, setFavor] = useState(() => Number(localStorage.getItem("sylvia-favor") || 0));
  const [offerCount, setOfferCount] = useState(() => Number(localStorage.getItem("sylvia-offers") || 0));

  const dateLabel = useMemo(() => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date()), []);

  function makeOffering() {
    if (!offering) return;
    const item = offerings.find(x => x.id === offering);
    const isHuman = item.kind === "human";
    const result = isHuman
      ? { title: "NGHI THỨC BỊ TỪ CHỐI", text: "“Các ngươi đúng là một giống loài ngu xuẩn. Đem một sinh mạng đến trước mặt ta rồi mong nhận được ân huệ sao? Cút đi, trước khi ta khiến các ngươi hiểu thế nào là sấm sét.”", icon: "⚡" }
      : { title: "LỄ VẬT ĐƯỢC CHẤP NHẬN", text: item.id === "flowers"
          ? "“Hoa đẹp đấy. Cánh hoa mỏng manh, nhưng vẫn biết cách khoe sắc. Ta thích món quà này.”"
          : item.id === "horns"
          ? "“Một hình dáng thú vị. Những đường cong tự nhiên này… quả thật rất đẹp.”"
          : item.id === "handmade"
          ? "“Ngươi đã tự tay làm thứ này ư? Khéo léo đấy. Ta trân trọng những thứ được tạo ra bằng sự kiên nhẫn.”"
          : "“Một mầm sống nhỏ bé. Hãy để nó bén rễ ở nơi có đủ ánh sáng.”", icon: "✧" };
    setOfferingResult(result);
    setStorm(isHuman);
    setOfferCount(n => { const v = n + 1; localStorage.setItem("sylvia-offers", v); return v; });
    if (!isHuman) setFavor(n => { const v = n + 1; localStorage.setItem("sylvia-favor", v); return v; });
    window.setTimeout(() => setStorm(false), 2200);
  }

  function pray() {
    const clean = prayer.trim();
    if (!clean) return;
    const shuffled = [...tarotDeck].sort(() => Math.random() - 0.5).slice(0, 3);
    setReading({ question: clean, cards: shuffled });
  }

  function sendChat(e) {
    e.preventDefault();
    const clean = chatInput.trim();
    if (!clean) return;
    setMessages(prev => [...prev, { from: "you", text: clean }, { from: "sylvia", text: chatReplies[Math.floor(Math.random() * chatReplies.length)] }]);
    setChatInput("");
  }

  return (
    <div className={`app ${storm ? "storm-mode" : ""}`}>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      {storm && <div className="lightning"><span /></div>}
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setTab("sanctuary")}><span className="brand-mark">✧</span><span>THE VERDANT SANCTUARY</span></a>
        <div className="top-meta"><span className="status-dot" /> THÁNH ĐIỆN ĐANG MỞ <span className="divider">/</span> {dateLabel}</div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span /> THE FIRST SEED · THE WORLD TREE</div>
            <h1>SYL<span>V</span>IA</h1>
            <p className="subtitle">The Verdant Primordial</p>
            <p className="intro">Thần Khởi Nguyên và Sinh Mệnh.<br/>Kẻ gieo mầm cho vạn vật, và cũng là người chứng kiến mọi tàn lụi.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => setTab("chat")}>GẶP GỠ THẦN LINH <span>↗</span></button>
              <button className="text-button" onClick={() => setTab("prayer")}>Gửi lời cầu nguyện <span>→</span></button>
            </div>
            <div className="hero-stats">
              <div><strong>{favor}</strong><span>ÂN SỦNG</span></div>
              <i />
              <div><strong>{offerCount}</strong><span>LỄ VẬT ĐÃ DÂNG</span></div>
            </div>
          </div>
          <div className="portrait-wrap">
            <div className="portrait-halo" />
            <div className="portrait-frame">
              <img src="/1.jpg" alt="Sylvia" onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }} />
              <div className="image-placeholder"><span>✧</span><b>SYLVIA</b><small>Đặt ảnh nhân vật tại đây</small><code>public/1.jpg</code></div>
            </div>
            <div className="portrait-caption"><span>Ⅰ</span> INCARNATION OF LIFE <span>✧</span></div>
            <div className="floating-leaf leaf-a">❧</div><div className="floating-leaf leaf-b">✧</div>
          </div>
        </section>

        <nav className="main-nav">
          {[["sanctuary","⌂","Thánh điện"],["offering","✧","Dâng lễ"],["prayer","☾","Cầu nguyện"],["chat","◇","Trò chuyện"]].map(([id,icon,label]) =>
            <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><span>{icon}</span>{label}</button>
          )}
        </nav>

        {tab === "sanctuary" && <section className="welcome-panel panel">
          <div className="section-kicker">A PLACE BETWEEN BEGINNING AND END</div>
          <h2>Thánh điện của <em>Sinh Mệnh</em></h2>
          <p>Không phải mọi lời cầu xin đều được đáp lại. Không phải mọi lễ vật đều được chấp nhận. Nhưng cánh cửa này vẫn mở — ít nhất là vào lúc này.</p>
          <div className="welcome-links">
            <button onClick={() => setTab("offering")}><span>01</span><b>Dâng lễ vật</b><small>Mang một món quà đến trước thần linh</small><i>↗</i></button>
            <button onClick={() => setTab("prayer")}><span>02</span><b>Thỉnh cầu lời tiên tri</b><small>Để những lá bài nói thay số phận</small><i>↗</i></button>
            <button onClick={() => setTab("chat")}><span>03</span><b>Đối thoại</b><small>Thưa chuyện cùng Sylvia</small><i>↗</i></button>
          </div>
        </section>}

        {tab === "offering" && <section className="content-panel panel">
          <div className="section-kicker">RITUAL I · THE OFFERING</div>
          <h2>Dâng lên <em>lễ vật</em></h2>
          <p className="panel-lead">Hãy chọn thứ ngươi muốn đặt trước thánh điện. Sylvia sẽ tự quyết định cách hồi đáp.</p>
          <div className="offering-grid">
            {offerings.map(item => <button key={item.id} className={`offering-card ${offering === item.id ? "selected" : ""} ${item.kind === "human" ? "forbidden" : ""}`} onClick={() => {setOffering(item.id); setOfferingResult(null);}}>
              <span className="offering-icon">{item.icon}</span><b>{item.name}</b><small>{item.detail}</small>{item.kind === "human" && <label>VẬT TẾ CẤM KỴ</label>}
            </button>)}
          </div>
          <button className="button button-primary action-button" disabled={!offering} onClick={makeOffering}>DÂNG LỄ VẬT <span>✧</span></button>
          {offeringResult && <div className={`response-card ${offering === "human" ? "anger" : ""}`}><span className="response-icon">{offeringResult.icon}</span><div><div className="section-kicker">{offeringResult.title}</div><p>{offeringResult.text}</p></div></div>}
        </section>}

        {tab === "prayer" && <section className="content-panel panel">
          <div className="section-kicker">RITUAL II · DIVINATION</div>
          <h2>Lời cầu nguyện <em>của ngươi</em></h2>
          <p className="panel-lead">Viết điều ngươi muốn hỏi. Ba lá bài sẽ được rút để đưa ra lời phán truyền.</p>
          <textarea className="prayer-input" value={prayer} onChange={e => setPrayer(e.target.value)} placeholder="Hỡi Sylvia, con muốn hỏi về..." maxLength={500} />
          <div className="input-foot"><span>{prayer.length}/500</span><button className="button button-primary" onClick={pray} disabled={!prayer.trim()}>RÚT BÀI TAROT <span>☾</span></button></div>
          {reading && <div className="reading">
            <div className="reading-question"><span>THỈNH CẦU</span>“{reading.question}”</div>
            <div className="tarot-grid">{reading.cards.map((card,i) => <article className="tarot-card" key={card.name}>
              <div className="card-position">{["QUÁ KHỨ","HIỆN TẠI","TƯƠNG LAI"][i]}</div>
              <div className="tarot-art"><span>{card.symbol}</span><small>{String(i+1).padStart(2,"0")}</small></div>
              <h3>{card.name}</h3><div className="card-vn">{card.vi}</div><p>{card.meaning}</p>
            </article>)}</div>
            <div className="oracle"><div className="section-kicker">SYLVIA'S INTERPRETATION</div><p>“Ba lá bài đã nằm xuống. Đừng xem chúng là mệnh lệnh, hỡi tín đồ. Chúng chỉ soi sáng những khả năng đang đan xen quanh ngươi. Lựa chọn cuối cùng vẫn thuộc về ngươi.”</p></div>
          </div>}
        </section>}

        {tab === "chat" && <section className="content-panel panel chat-panel">
          <div className="section-kicker">RITUAL III · DIRECT COMMUNION</div>
          <h2>Đối thoại cùng <em>Sylvia</em></h2>
          <p className="panel-lead">Ngươi có thể thưa chuyện với vị thần đang ngự nơi đây.</p>
          <div className="chat-window">
            {messages.map((m,i) => <div className={`message ${m.from}`} key={i}><div className="message-avatar">{m.from === "you" ? "◈" : "✧"}</div><div><small>{m.from === "you" ? "TÍN ĐỒ" : "SYLVIA"}</small><p>{m.text}</p></div></div>)}
          </div>
          <form className="chat-form" onSubmit={sendChat}><input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Nói điều ngươi muốn thưa..." maxLength={400}/><button type="submit" disabled={!chatInput.trim()}>GỬI ↗</button></form>
          <div className="chat-note">Lời hồi đáp hiện sử dụng bộ hội thoại mẫu. Có thể kết nối AI API trong phiên bản tiếp theo.</div>
        </section>}
      </main>

      <footer><div className="footer-mark">✧</div><div><b>THE VERDANT PRIMORDIAL</b><span>“All things begin. All things return.”</span></div><small>© THE SANCTUARY OF SYLVIA</small></footer>
      {storm && <div className="storm-text">ĐỪNG MANG SINH MẠNG ĐẾN TRƯỚC MẶT TA.</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
