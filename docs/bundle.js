// import axios from 'axios'
// import increment from "./increment";
// console.log(increment(3));
// import { AboutComponent } from './AboutComponent.js'

const NotFoundComponent = { template: '<p>Page not found</p>' }
const AboutComponent = {
  data () {
    return {
      input_url: '',
      gist_url: '',
      is_gist_url: false,
      is_valid_json: 0,
      url_copied: 'Copy URL',
    }
  },
  computed: {
    computedUrl() {
      let message
      // returns = checkGistURL(this.input_url)
      [this.gist_url, message, this.is_gist_url] = checkGistURL(this.input_url)
      // return this.input_url ? (this.gist_url || message) : ''
      return message
    },
    is_not_new_url() {
      if (!this.is_gist_url) {
        this.is_valid_json = 0
        this.url_copied = 'Copy URL'
        return false
      }
      return true
    }
  },
  methods: {
    checkJson() {
      if (this.input_url) {
        let result = checkValidJson(this.input_url)
        result.then(res => this.is_valid_json = res)
      }
    },
    copyUrl() {
      navigator.clipboard.writeText(this.gist_url)
      this.url_copied = 'Copied ✅'
    }
  },
  template: `
  <section>
    <h2>Create your own list</h2>
    <div class="line">
      <input class="gist" v-model="input_url" placeholder="Paste gist URL here">
      <button @click="checkJson()" class="gist" :disabled="!(this.is_gist_url)"> {{ computedUrl }} </button>
    </div>
    <div v-if="is_valid_json == 1 && is_not_new_url">
      <pre><code>{{ gist_url }}</code></pre>
      <div class="line">
      <button class="valids" @click="copyUrl()">{{ this.url_copied }}</button>
      <a class="valids" :href="gist_url"> Open URL </a>
      </div>
    </div>
    <div class="line" v-if="is_valid_json == -1">
      <pre>無効な形式のJsonです</pre>
    </div>
  </section>
  <section class="postcontent">
    <h3>Step.1</h3>
    <p><a href="https://gist.github.com/octosango/b70285fbb8ef1f09562f16959002e649">Jsonの例</a>を参考に同じようなKeyを持つJsonを作成する。</p>
    <h3>Step.2</h3>
    <p><a href="https://gist.github.com">Gist</a>に投稿する。<br/>「Raw」ボタンをクリックし、遷移したページのURLをコピー。</p>
    <h3>Step.3</h3>
    <p>上のフォームにURLをコピペする。</p>
    <h3>Step.4</h3>
    <p>形式がOKかのチェックを通れば完成</p>
  </section>
  <h2>About this site</h2>
  <section class="postcontent">
    <p>Created by <a href="https://github.com/mizphses/links.chuo.club">mizpheses</a>, Forked by <a href="https://github.com/octosango/links.chuo.club">octosango</a>.</p>
    
    <p>中大に関わるリンクをまとめたサイトである<a href="https://links.chuo.club">CLink</a>をもとに、<a href="https://gist.github.com/">GitHub Gist</a>へ投稿した任意のJsonファイルを表示する機能を追加したサイトです。</p>
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
  '#/main': MainComponent,
  '#/about': AboutComponent,
}

const SimpleRouter = {
  data() {
    // let route = ''
    // if (window.location.hash == '#/about') {
    //   route = '#/about'
    // } else {
    //   route = '#/main'
    // }
    return {
      currentRoute: window.location.hash,
      data: json,
    }
  },

  computed: {
    CurrentComponent() {
      // ここで構造が正規か判定するのが良さそう
      // return routes[this.currentRoute] || NotFoundComponent
      return routes[this.currentRoute] || MainComponent
    }
  },

  watch: {
    $route(to) {
      let route = ''
      if (window.location.hash == '#/about') {
        route = '#/about'
      } else if (window.location.hash == '#/') {
        route = '#/main'
      } else {
        route = '#/main'
      }
      console.log('url changed');
      this.currentRoute = route
    }
  },

  components: {
    // 'header-component-nyan': HeaderComponent
  },

  render() {
    return Vue.h(this.CurrentComponent)
  }
}


function checkGistURL(input_text) { // return [url, message, bool]
  try { new URL(input_text) }
  catch { return ['', (input_text ? 'invalid url' : 'No input'), false] }
  let input_url = new URL(input_text) 
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
      path = `${input_url.pathname}`
    }
  } else {
    return ['', 'not gist url', false]
  }

  // re turn new URL(`https://octosango.github.io/links.chuo.club/#${path}`)
  return [`https://octosango.github.io/links.chuo.club/#${path}`, 'チェック', true]
}

async function checkValidJson(url) {
  try {
    const response = await fetch(url)
    if (response.ok) {
      const json = await response.json()
      if (json.hasOwnProperty('sites')) {
        return +1
      }
      return -1
    } else {
      return -1
    }
  } catch {
    return -1
  }
}

const flagment = window.location.hash
let url = new URL('https://raw.githubusercontent.com/mizphses/links.chuo.club/main/links.json')
let path = ''
let json = null
let json_user = null

// if (flagment.match(/^\#[/-\w]+\.json$/i)) {
if (flagment.match(/^\#\/(about|create)/i)) {
  ;
} else if (flagment.match(/^\#[\./-\w]+$/i)) {
  path = flagment.slice(1)
  // url = new URL(`https://gist.githubusercontent.com${path}`)
  urlTemp = new URL(`https://gist.githubusercontent.com${path}`)
  checkValidJson(urlTemp).then(res => {
    if (res == 1) {
      url = urlTemp
    }
  })
}
// console.log(url)

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