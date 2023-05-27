const NotFoundComponent = { template: '<p>Page not found</p>' }
const AboutComponent = { template: '<p>About page</p>' }
const HeaderComponent = {
  template: `
  <header>
    <h1>タイトルです</h1>
  </header>
  `
}
const MainComponent = {
  data() {
    return {
    links: structuredClone(json),
    clicked_buttons: [],
    category_visible: false,
    user: json_user,
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
    <p>
      このサイトは
      <a v-if="user" :href="user.html_url">{{ user.login }}</a>
      <a v-else href="https://github.com/mizphses">mizphses</a>
      が選んだ，とりあえずブックマークしておいた方がいい大学のサイト一覧です。
    </p>
    <p v-if="!user">ページの追加は<a href="https://github.com/mizphses/links.chuo.club/issues/new/choose">こちら</a>からご申請ください。お問い合わせも同様にお願いいたします。</p>
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

const routes = {
  // '': MainComponent,
  // '#/': HomeComponent,
  '#/': MainComponent,
  '#/about': AboutComponent
  // これ拡張性捨てていいなら、いらないのでは
}

const SimpleRouter = {
  data() {
    return {
      // currentRoute: window.location.pathname
      // ここ冗長なのはいいけれど、強引なのは直したい
      // fetchの段階でjsonではないファイルは弾かれている。ここらへんで判断するなら中身の正規性か
      // 不正規のjsonでもページ自体は表示されるが、カテゴリもカードもない。エラー画面に飛ばしたい
      // githubユーザ名は表示されるので、最低限の動作はすると捉える
      // url生成ページ作りたいよね。ちなmicrosoft解説ページは正常に動作している
      currentRoute: '#/',
      data: json,
    }
  },

  computed: {
    CurrentComponent() {
      // ここで構造が正規か判定するのが良さそう
      return routes[this.currentRoute] || NotFoundComponent
    }
  },

  // components: {
  //   'header-component-nyan': HeaderComponent
  // },

  render() {
    return Vue.h(this.CurrentComponent)
  }
}


const flagment = window.location.hash
let url = 'https://raw.githubusercontent.com/mizphses/links.chuo.club/main/links.json'
let path = ''
let json = null
let json_user = null

if (flagment.match(/^\#[/-\w]+\.json$/i)) {
  path = flagment.slice(1)
  url = `https://gist.githubusercontent.com${path}`
}

async function main () {
  const response = await fetch(url)
  json = await response.json()

  if (path) {
    const user = path.match(/^\/([-\w\.]+?)\//i)[1]
    url = `https://api.github.com/users/${user}`
    const response = await fetch(url)
    json_user = await response.json()
  }

  const app = await Vue.createApp(SimpleRouter)
  app.component('header-component-nyan', HeaderComponent)
  app.mount('#app');
}

main()