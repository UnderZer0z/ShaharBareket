import './style.css'


const blogAPI = "https://blog.bareket.co/feeds/posts/default?alt=json-in-script&callback=blogfeed";

function blogfeed(data){
    console.log(data.feed.entry)

    // update up to 5 baked list items
    const posts = data.feed.entry || [];
    const anchors = document.querySelectorAll("#blog ul li a");
    anchors.forEach((anchor, index) => {
        const post = posts[index];
        if (!post) return; // keep placeholder if no post
        const link = (post.link || []).find(l => l.rel === 'alternate')?.href
                     || (post.link && post.link[2] && post.link[2].href)
                     || '#';
        const title = post.title?.$t || '';
        const excerpt = truncateTo20Words(post.content?.$t || post.summary?.$t || '');
        const imgUrl = post?.media$thumbnail?.url ? thumbnailResize(post.media$thumbnail.url, 500) : 'https://placehold.co/320x200/png';

        anchor.href = link;
        const imgEl = anchor.querySelector("img");
        if (imgEl) imgEl.src = imgUrl;
        const h3 = anchor.querySelector("h3");
        if (h3) h3.textContent = title;
        const p = anchor.querySelector("p");
        if (p) p.textContent = excerpt;
    });

    // existing blog list handling (keeps compatibility)
    let articles = document.querySelectorAll("#blog li a");
    console.log(articles)
    articles.forEach((element , index) => {
        let post = data.feed.entry[index]
        if(!post) return;
        try {
            const alt = post.link.find(l=> l.rel === 'alternate')?.href
            element.href = alt || post.link[2].href
            element.querySelector("h3").textContent = post.title.$t
            element.querySelector("p").textContent = truncateTo20Words(post.content.$t)
            if(post?.media$thumbnail?.url){
                element.querySelector("img").src = thumbnailResize(post.media$thumbnail.url , 500)
            }
        } catch (e) { /* ignore malformed entries */ }
    });

}


function addScript(srcLink){
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", srcLink);
    document.body.appendChild(script);
}

function truncateTo20Words(input) {
  const textOnly = input.replace(/<[^>]*>/g, '');
  const words = textOnly.trim().split(/\s+/);
  const truncated = words.slice(0, 20).join(' ');
  return words.length > 20 ? truncated + '...' : truncated;
}

function thumbnailResize(url, size = 400) {
    return url.replace(/\/s72(-[^/]*)?\//, `/s${size}$1/`);
}

// Contact Form functionality
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const responseMsg = document.getElementById("responseMsg");

    // Make sure the form exists
    if (!form) {
        console.error("❌ contactForm element not found in the DOM.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const url = form.action;
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();

        if (!name || !email || !message) {
            responseMsg.textContent = "❌ Please fill out all required fields completely (no empty spaces).";
            return;
        }
        
        formData.set('name', name);
        formData.set('email', email);
        formData.set('message', message);

        const elements = form.elements;
        for (let el of elements) el.disabled = true;
        responseMsg.textContent = "⏳ Sending...";

        try {
            const response = await fetch(url, {
                method: "POST",
                body: new URLSearchParams(formData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' 
                },
                credentials: 'omit',
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
            }

            let result;
            try {
                result = await response.json();
            } catch (e) {
                result = { success: false, message: "Could not parse server response." };
            }

            console.log("✅ Server Response:", result);

            if (result.success) {
                responseMsg.textContent = "✅ " + result.message;
                form.reset();
            } else {
                responseMsg.textContent = "❌ Failed: " + (result.message || "Unknown error occurred.");
            }

        } catch (error) {
            console.error("❌ Error:", error);
            responseMsg.textContent = "❌ Failed to send message. Network or script error.";

        } finally {
            // Re-enable form inputs
            // for (let el of elements) el.disabled = false;
        }
    });
});



window.blogfeed = blogfeed;
addScript(blogAPI)