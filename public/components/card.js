const template = document.createElement("template");
template.innerHTML = `
<style>
  #card {
    height: 50vh;
    width: 320px;
    text-align:center;
    background-color: #fff;
    background: linear-gradient(#f8f8f8, #fff);
    box-shadow: 0 8px 16px -8px rgba(0,0,0,0.4);
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-end;
    align-content: center;
    align-items: stretch;
    margin: 1.5rem;
    height: calc(100% - 2*1.5rem);
  }
  #content{
    flex: 1 1 auto;
  }
  #answers {
    flex: 0 1 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: stretch;
    align-items: flex-end;
  }
  #answers button {
    order: 0;
    flex: 1 1 auto;
    text-transform: uppercase;
    font-size: calc(var(--main-text-size) - 20%);
    letter-spacing: 0.1rem;
    padding: 0.8rem 0.5rem;
    border: 0.2rem solid white;
    background-color: var(--main-accent-color2);
    color: white;
    border-radius: 0.5rem;
  }
  #answers button:focus {
    outline:0;
  }
  #answers button:hover {
    background-color: var(--main-accent-color3);
  }
  #answers .next {
    background-color: var(--main-accent-color3);
  }
  .translated {
    font-family: Arial;
    font-style: italic;
  }


  .article,
  .en,
  .example,
  .next {
    display:none;
  }
  .error .article {
    color: var(--main-accent-color1);
  }
  .correct .article {
    color: var(--main-accent-color2);;
  }
  .show-next .en,
  .show-next .example {
    display: block;
  }
  .show-next .article,
  .show-next .next {
    display: inline;
  }
  .show-next .answer {
    display: none;
  }
}
</style>
<div id="card" class="animate animateOut">
  <div class="wrapper">
    <div id="content">
    </div>
    <div id="answers">
      <button class="answer">der</button>
      <button class="answer">die</button>
      <button class="answer">das</button>
      <button class="next">next</button>
    </div>
  </div>
</div>
`;

class Card extends HTMLElement {
  constructor() {
    super();
    // console.log("constructor called");
    this._word = {};
    this.correctAnswer = false;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content);
    this.$card = this.shadowRoot.querySelector("#card");
    this.$content = this.shadowRoot.querySelector("#content");
  }
  connectedCallback() {
    this.shadowRoot.querySelectorAll(".answer").forEach(el => {
      el.addEventListener("click", e => this._checkAnswer(e));
    });
    this.shadowRoot.querySelectorAll(".next").forEach(el => {
      el.addEventListener("click", e => this._submitAnswer(e));
    });
  }
  get word() {
    return this._word;
  }

  set word(value) {
    if (this._word === value) return;
    this.$card.classList.remove("error", "correct");
    this._word = value;
    this._renderContent();
    this.setAttribute("word", JSON.stringify(this._word));
  }

  disconnectedCallback() {
    // console.log("disconnected!");
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log(`Attribute: ${attrName} changed: ${newVal}`);
    switch (attrName) {
      case "word":
        if (JSON.stringify(this.word) !== newVal) {
          this.word = JSON.parse(newVal);
        }
        break;
    }
  }

  static get observedAttributes() {
    return ["word", "variation"];
  }
  _renderContent() {
    if (!this.word && !this.word.article) return;
    this.$card.classList.remove("show-next");
    this.$content.innerHTML = `
        <h2 clas="de"><span class="article">${this.word.article} </span>${this.word.de}</h2>
        <h4 class="en translated">( ${this.word.en} )</h4>
        <p class="example">
          ${this.word.exampleDE}
          <br><sub class="translated">( ${this.word.exampleEN} )</sub>
        </p>

      `;
  }
  _checkAnswer(e) {
    if (this.word.article === e.target.textContent) {
      this.correctAnswer = true;
      this.$card.classList.add("correct", "show-next");
    } else {
      this.correctAnswer = false;
      this.$card.classList.add("error", "show-next");
    }
  }
  _submitAnswer() {
    this.dispatchEvent(
      new CustomEvent("selected-answer", { detail: this.correctAnswer })
    );
  }
  _deviceOrientationHandler(e) {
    console.log(e);
  }
}
export default Card;
customElements.define("cx-card", Card);
