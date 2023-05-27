const MainComponent = {
  data() {
    return {
    links: structuredClone(json),
    clicked_buttons: [],
    category_visible: false,
    }
  },
  methods: {
    filter_category(category) {
    if (category === 'clear') {
      this.clicked_buttons = []
      this.links = structuredClone(json)
      return
    }
    if (this.is_clicked(category)) {
      (this.clicked_buttons).splice((this.clicked_buttons).indexOf(category), 1);
    } else {
      this.clicked_buttons.push(category)
    }
    this.links.sites = structuredClone(json).sites.filter(site =>
      this.clicked_buttons.every(btn => new Set(site.category).has(btn)))
    },
    show_categories() {
      this.category_visible = !this.category_visible
    },
    is_clicked(category_name){
      return new Set(this.clicked_buttons).has(category_name)
    }
  },
  template: `
  <div>
    <h2>このサイトについて</h2>
    <p>このサイトはmizphsesが選んだ，とりあえずブックマークしておいた方がいい大学のサイト一覧です。</p>
    <p>ページの追加は<a href="https://github.com/mizphses/links.chuo.club/issues/new/choose">こちら</a>からご申請ください。お問い合わせも同様にお願いいたします。</p>
  </div>
  <div>カテゴリ選択画面を表示する <button v-on:click="show_categories()">表示/非表示</button></div>
  <div class="category-buttons" v-if="category_visible">
    <span v-for="category in links.categories">
      <button v-on:click="filter_category(category.name)" class="category-button" :class="{'clicked-button':is_clicked(category.name)}">
      {{ category.description }}
      </button>
    </span>
      <button v-on:click="filter_category('clear')" class="category-button">
      全て
      </button>
    </div>
    <h3>現在選択されているカテゴリ</h3>
    <div class="category-buttons">
    <span v-for="category in clicked_buttons">
      <span v-on:click="filter_category(category)" class="category-button">
      {{ category }}
      </span>
    </span>
    <span v-if="clicked_buttons.length === 0">
      <span class="category-button">
      全て
      </span>
    </span>
    </div>
    <div class="links">
    <div v-for="link in links.sites" class="link">
      <a :href="link.url" target="_blank" rel="noopener noreferrer">
        <div class="link-box">
          <div class="link__title">{{ link.name }}</div>
            <div class="page">{{ link.url }}</div>
            <div class="category-tags-shown-on-link">
              <span v-for="category in link.category">
                <span class="category-tags-shown-on-link-inside">{{ category }}</span>
              </span>
            </div>
          <div class="link__description">{{ link.description }}</div>
          <div class="ms-login" v-if="link.category.includes('microsoft')">
            <a href="./login-with-m-chuo-u.html">中大Microsoftアカウントでログインするには</p>
          </div>
        </div>
      </a>
    </div>
    <div v-if="this.links.sites === undefined || this.links.sites.length === 0" class="sites-none">
      <p class="sites-none-text">該当するサイトはありません。<button v-on:click="filter_category('clear')">全てのサイトを表示する</button></p>
    </div>
  </div>
  `
}

let json = null
fetch('https://raw.githubusercontent.com/mizphses/links.chuo.club/main/links.json')
  .then(response => response.json())
  .then(jsons => {
    json = jsons
    if (!json.categories) {
    json.categories = (Array.from(new Set(json.sites.map(site => site.category).flat())))
      .map(name => ({"name": name, "description": name}))
    }
    const app = Vue.createApp(MainComponent)
    app.mount('#app')
  })