const blogEl = document.querySelector('.blog')

function menuopen(){
    document.getElementById("menu").style.display = 'block';
}


function menuclose(){
    document.getElementById("menu").style.display = 'none';
}

var links = document.querySelectorAll('.alink')

links.forEach(element => {
    element.addEventListener("click", menuclose);
});


function loadblog(data){

    let element = data.feed.entry;

    for(i = 0 ; i < 3 ; i++){

        let post = document.createElement('article')

        let title = document.createElement('h1')
        title.innerHTML = element[i].title[0]._;
        post.appendChild(title)

        let content = document.createElement('div')
        content.innerHTML = element[i].content[0]._;
        content.setAttribute('class','content')
        post.appendChild(content)

        let btn = document.createElement('div')
        btn.setAttribute('class','btn-link')
        let link = document.createElement('a')
        link.innerText = 'המשך לקרוא'
        link.href = element[i].link[4].$.href
        btn.appendChild(link)
        post.appendChild(btn)

        blogEl.appendChild(post)
        //console.log(element.title[0]._)
        //console.log(element.content[0]._)

    };
}



fetch('https://rsstojson.com/v1/api/?rss_url=https://dinodeveloper.blogspot.com/feeds/posts/default?')
  .then(response => response.json())
  .then(json => loadblog(json))