// import axios from 'axios'
// import increment from "./increment";
// console.log(increment(3));
// import { AboutComponent } from './AboutComponent.js'

const NotFoundComponent = { template: '<p>Page not found</p>' }
const AboutComponent = {
  data () {
    return {
      // gist_url: 'https://gist.githubusercontent.com',
      gist_url: '',
      is_url: false,
      results: '',
    }
  },
  computed: {
    computedUrl() {
      this.is_url = false
      // これグローバルにしてfetchのところでもvalidateするか
      try { new URL(this.gist_url) }
      catch { return this.gist_url ? 'invalid url' : 'Paste gist URL up there' }
      let input_url = new URL(this.gist_url) 
      let path = ''
      if (input_url.host == 'gist.github.com') {
        path = `${input_url.pathname}/raw/`
      } else if (input_url.host == 'raw.githubusercontent.com') {
        path = `${input_url.pathname}`
      } else if (input_url.host == 'gist.githubusercontent.com') {
        let components = input_url.pathname.split('/')
        if (components.length == 6) {
          //octosango/b70285fbb8ef1f09562f16959002e649/raw/ba112f33a3828ca86427becabb8165a81c4a24bf/links.json
          components.splice(4,1)
          path = `${components.join('/')}`
        } else if (components.length == 5 && components[-1].match(/[0-9a-f]{40}/)) {
          //octosango/b70285fbb8ef1f09562f16959002e649/raw/ba112f33a3828ca86427becabb8165a81c4a24bf
          path = `${components.pop().join('/')}`
        } else {
          //octosango/b70285fbb8ef1f09562f16959002e649/raw/links.json
          //octosango/b70285fbb8ef1f09562f16959002e649/raw/
          // others
          path = `${input_url.pathname}`
        }
      } else {
        return 'not gist url'
      }
      // re turn new URL(`https://octosango.github.io/links.chuo.club/#${path}`)
      this.is_url = true
      // checkURL
      // checkUrl()
      return `https://octosango.github.io/links.chuo.club/#${path}`
    }
  },
  methods: {
    checkUrl() {
      axios
        .get(computedUrl)
        .then(res => {
          this.results = res.data.code == 200 ? res.data.data.fullAddress : res.data.message
        })
    }
  },
  template: `
  <section>
    <h2>Create your own list</h2>
    <input v-model="gist_url" placeholder="Paste gist URL here">
    <div v-if="is_url && results">
      <a :href="computedUrl"> {{ computedUrl }} </a>
      <p :key="results"> {{ results }} </p>
    </div>
    <div v-if="is_url">
      <button @click="checkUrl()">Check URL</button>
      <br>
      <a :href="computedUrl"> {{ computedUrl }} </a>
    </div>
    <div v-else> {{ computedUrl }} </div>
    <p>form -- copy - open</p>
    <p>1. create json, 2. copy url, 3. peste it on form, 4. done</p>
  </section>
  <section>
    <h2>About this site</h2>
    <p>Created by mizpheses, Forked by octosango</p>
  </section>
  `
}
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
  '#/': MainComponent,
  '#/about': AboutComponent,
}

const SimpleRouter = {
  data() {
    return {
      currentRoute: window.location.hash || '#/',
      data: json,
    }
  },

  computed: {
    CurrentComponent() {
      // ここで構造が正規か判定するのが良さそう
      return routes[this.currentRoute] || NotFoundComponent
    }
  },

  components: {
    // 'header-component-nyan': HeaderComponent
  },

  render() {
    return Vue.h(this.CurrentComponent)
  }
}

function urlValidation(url, ) {
  return url, is_url
}


const flagment = window.location.hash
let url = new URL('https://raw.githubusercontent.com/mizphses/links.chuo.club/main/links.json')
let path = ''
let json = null
let json_user = null

if (flagment.match(/^\#[/-\w]+\.json$/i)) {
  // rawまででjsonが表示されることがあるため不十分
  path = flagment.slice(1)
  url = new URL(`https://gist.githubusercontent.com${path}`)
}

async function main () {
  const response = await fetch(url)
  json = await response.json()

  if (path) {
    const user = path.match(/^\/([-\w\.]+?)\//i)[1]
    url = new URL(`https://api.github.com/users/${user}`)
    const response = await fetch(url)
    json_user = await response.json()
  }

  const app = await Vue.createApp(SimpleRouter)
  app.component('header-component-nyan', HeaderComponent)
  app.mount('#app');
}

main()