import "./card.js";
const template = document.createElement("template");
template.innerHTML = `
<style>
:host {
  --app-bg-color: white;
  --app-text-size: var(--main-text-size);
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: stretch;
    align-items: center;
    height: 100vh;
}
cx-card {
    flex: 0 1 auto;
    align-self: auto;
}
</style>
<cx-card></cx-card>
`;
class App extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content);
    this.$card = this.shadowRoot.querySelector("cx-card");
    this.words = {};
    this._remainingWords = [];
    this._activeWord = {};
  }
  async connectedCallback() {
    await this._getWords();
    this._render();

    this.$card.addEventListener("selected-answer", e => {
      if (this._remainingWords.length > 0) {
        this._remainingWords.shift();
        this._activeWord = this.words[this._remainingWords[0]];
        this._render();
      }
    });
  }

  disconnectedCallback() {
    // console.log("disconnected!");
  }
  _getWords() {
    return fetch("/api/words")
      .then(result => result.json())
      .then(json => {
        this.words = json;
        this._remainingWords = Object.keys(this.words);
        this._activeWord = this.words[this._remainingWords[0]];
      });
  }
  _render() {
    // this.$card.setAttribute("word", JSON.stringify(this._activeWord));
     this.$card.word = this._activeWord;
  }
}
export default App;
customElements.define("cx-app", App);
