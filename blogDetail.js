const client = contentful.createClient({
  space: "7rufusqf1lif",
  accessToken: "jSOOrRU7tKzvGkxKx2AHup0w9bnEuHsGEBqfJQ594bs",
});

const fetchContent = async () => {
  const blog = localStorage.getItem("blogID");
  console.log("Fetching blog", blog);

  try {
    // Fetch entries from Contentful using the client
    const response = await client.getEntries();

    // Log the entire response object to verify data
    console.log("API Response: ", response.items);

    // Check if any items were fetched
    if (response.items.length > 0) {
      // Filter entries to include only the selected blog entry by ID
      const blogEntries = response.items.filter(
        (item) => item.fields.blogId == blog
      );

      // Log each blog entry's fields
      blogEntries.forEach((entry) => {
        console.log("Entry Fields: ", entry.fields);
      });

      // Map over the entries and extract the desired data
      const mappedData = blogEntries.map((entry) => {
        const fields = entry.fields;

        return {
          blog_id: fields.blogId || "No ID available",
          blog_thumbnail: fields.blogThumbnail?.fields?.file?.url
            ? `https:${fields.blogThumbnail.fields.file.url}`
            : "No thumbnail available",
          blog_title: fields.blogTitle || "No title available",
          blog_tags: fields.blogTag || ["No tags available"],
          blog_short_description:
            fields.blogThumbnail?.fields?.description ||
            "No short description available", // Correct access to the description
          blog_content: fields.blogContent?.content || "No content available",
          author_name:
            fields.authorName?.fields?.authorName || "No author name available",
          author_image: fields.authorName?.fields?.authorImage1?.fields?.file
            ?.url
            ? `https:${fields.authorName.fields.authorImage1.fields.file.url}`
            : "No author image available",
        };
      });

      // Clear any previous content
      const blogGrid = document.querySelector("#blog-details");
      blogGrid.innerHTML = "";

      // Insert the mapped data into the HTML
      mappedData.forEach((item) => {
        const blogItem = document.createElement("div");
        blogItem.classList.add("w-dyn-item");

        let tagsHTML = "";
        item.blog_tags.forEach((tag) => {
          tagsHTML += `<p class="data-categories-block label hover ">${tag}</p>`;
        });

        // document.querySelector("#tags-container").innerHTML = tagsHTML;

        // Add onclick to store the blog ID in local storage

        blogItem.innerHTML = `
  <div role="listitem" class="">
    <div class="">
      <a href="#" class="" onclick="setBlogId('${item.blog_id}')"></a>
    </div>

    <div class="base-container-stream w-container">
      <a href="#" class="w-inline-block" onclick="setBlogId('${item.blog_id}')">
        <h5 class="details-page-title spacing">${item.blog_title}</h5>
      </a>

      <!-- Blog Thumbnail -->
      <img
        src="${item.blog_thumbnail}"
        loading="lazy"
        alt="Blog Thumbnail"
        sizes="(max-width: 479px) 100vw, (max-width: 767px) 96vw, (max-width: 991px) 46vw, (max-width: 1279px) 30vw, (max-width: 1919px) 370px, 470px"
        class="blog-template-image"
      />
       <h5 class="title">${item.blog_title}</h5>
      <!-- Blog Tags -->
      <div class="">
        <a href="#" class="tags">${tagsHTML}</a>
      </div>
      
      <!-- Blog Short Description -->
      <p class="rich-text-style w-richtext">${
        item.blog_short_description
      }</p> <!-- Short description -->
  
      <!-- Blog Content -->
      <div class="rich-text-style w-richtext" id="blog-content">
        ${item.blog_content
          .map((contentItem) => renderBlogContent(contentItem))
          .join("")}
      </div>

      <!-- Author Section -->
      <div class="author-section">
        <img
          src="${item.author_image}"
          alt="Author Image"
          class="author-image"
          style="width: 50px; border-radius: 50%;" />
        <span class="author-name">${item.author_name}</span>
      </div>
    </div>
  </div>
`;

        // console.log("Short Description: ", item.blog_short_description);

        blogGrid.appendChild(blogItem);
      });
    } else {
      console.log("No content found.");
    }
  } catch (error) {
    console.error("Error fetching content:", error);
  }
};

// Helper function to render rich text content
function renderBlogContent(contentItem) {
  switch (contentItem.nodeType) {
    case "paragraph":
      return `<p>${contentItem.content.map((text) => text.value).join("")}</p>`;
    case "heading-1":
      return `<h1>${contentItem.content
        .map((text) => text.value)
        .join("")}</h1>`;
    case "heading-2":
      return `<h2>${contentItem.content
        .map((text) => text.value)
        .join("")}</h2>`;
    case "unordered-list":
      return `<ul>${contentItem.content
        .map((li) => `<li>${li.content[0].content[0].value}</li>`)
        .join("")}</ul>`;
    default:
      return `<p>Unsupported content type: ${contentItem.nodeType}</p>`;
  }
}

// Call the fetchContent function on page load
window.onload = fetchContent;
