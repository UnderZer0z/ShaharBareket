const blogEl = document.querySelector('.blog')


function loadblog(data){
    console.log(data)
    data.feed.entry.forEach(element => {

        let post = document.createElement('article')

        let title = document.createElement('h1')
        title.innerHTML = element.title[0]._;
        post.appendChild(title)

        let content = document.createElement('div')
        content.innerHTML = element.content[0]._;
        content.setAttribute('class','content')
        post.appendChild(content)

        let btn = document.createElement('div')
        btn.setAttribute('class','btn-link')
        let link = document.createElement('a')
        link.innerText = 'המשך לקרוא'
        link.href = element.link[4].$.href
        btn.appendChild(link)
        post.appendChild(btn)

        blogEl.appendChild(post)
        //console.log(element.title[0]._)
        //console.log(element.content[0]._)

    });
}



fetch('https://rsstojson.com/v1/api/?rss_url=https://dinodeveloper.blogspot.com/feeds/posts/default?')
  .then(response => response.json())
  .then(json => loadblog(json))