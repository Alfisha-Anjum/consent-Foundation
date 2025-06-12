// Function to get the blogId from the URL query parameters
function getBlogIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("blogId"); // Returns the blogId or null if not found
}

// Function to fetch and display the blog details based on the blogId
const fetchBlogDetails = async () => {
  const blogId = getBlogIdFromURL();
  if (!blogId) {
    console.error("No blog ID found in the URL.");
    return;
  }

  try {
    // Fetch entries from Contentful using the client
    const response = await client.getEntries({
      content_type: "consentBlog", // Ensure you're fetching the right content type
      "fields.BlogId": blogId, // Use the blogId to filter the specific entry
    });

    if (response.items.length > 0) {
      const blog = response.items[0].fields;

      // Display blog details on the page
      const blogGrid = document.querySelector("#blog-details");
      blogGrid.innerHTML = ""; // Clear previous content

      const blogItem = document.createElement("div");
      blogItem.classList.add("main-div-main");

      // Generate HTML for tags
      let tagsHTML = "";
      (blog.blogTags || []).forEach((tag) => {
        tagsHTML += `<p class="data-categories-block label hover">${tag}</p>`;
      });

      // Render blog content
      blogItem.innerHTML = `
        <div role="listitem" class="">
          <div class="">
            <a href="#" class="" onclick="setBlogId('${blog.blogId}')"></a>
          </div>

          <div class="base-container-stream-2 w-container">
            <a href="#" class="w-inline-block" onclick="setBlogId('${
              blog.blogId
            }')">
<a href="home.html">
<button class="primary-button-4">
            <i class="fa-solid fa-chevron-left"></i> <span class="back">Back</span></button></a>
            
              <h5 class="details-page-title spacing">${
                blog.blogTitle || "No title available"
              }</h5>

            </a>


             <!-- Blog Tags -->
            <div class="tagss">
              ${tagsHTML}
            </div>
            
            <!-- Blog Thumbnail -->
            <img
              src="${
                blog.blogThumbnail?.fields?.file?.url
                  ? `https:${blog.blogThumbnail.fields.file.url}`
                  : "No thumbnail available"
              }"
              loading="lazy"
              alt="Blog Thumbnail"
              sizes="(max-width: 479px) 100vw, (max-width: 767px) 96vw, (max-width: 991px) 46vw, (max-width: 1279px) 30vw, (max-width: 1919px) 370px, 470px"
              class="blog-template-image"
            />

           

            <!-- Blog Content -->
            <div class="rich-text-style w-richtext" id="blog-content">
              ${blog.blogContent?.content
                .map((contentItem) => renderBlogContent(contentItem))
                .join("")}
            </div>

            <!-- Author Section -->
           <div class="author-section">
  <a href="${
    blog.authorDetails?.fields?.linked ? blog.authorDetails.fields.linked : "#"
  }" target="_blank">
    <img
      src="${
        blog.authorDetails?.fields?.authorImage?.fields?.file?.url
          ? `https:${blog.authorDetails.fields.authorImage.fields.file.url}`
          : "No author image available"
      }"
      alt="Author Image"
      class="author-image"
      style="width: 50px; border-radius: 50%;" />
  </a>
  <a href="${
    blog.authorDetails?.fields?.linked ? blog.authorDetails.fields.linked : "#"
  }" target="_blank">
    <span class="author-name">${
      blog.authorDetails?.fields?.authorName || "No author name available"
    }</span>
  </a>
</div>

        </div>
      `;

      blogGrid.appendChild(blogItem);
      console.log(blog);
      console.log(blogItem);
    } else {
      console.log("No blog details found.");
    }
  } catch (error) {
    console.error("Error fetching blog details:", error);
  }
};

// Helper function to render rich text content
function renderBlogContent(contentItem) {
  switch (contentItem.nodeType) {
    case "paragraph":
      return `<p>${contentItem.content.map(renderText).join("")}</p>`;

    case "heading-1":
      return `<h1>${contentItem.content.map(renderText).join("")}</h1>`;

    case "heading-2":
      return `<h2>${contentItem.content.map(renderText).join("")}</h2>`;

    case "heading-3":
      return `<h3>${contentItem.content.map(renderText).join("")}</h3>`;

    case "heading-4":
      return `<h4>${contentItem.content.map(renderText).join("")}</h4>`;

    case "heading-5":
      return `<h5>${contentItem.content.map(renderText).join("")}</h5>`;

    case "heading-6":
      return `<h6>${contentItem.content.map(renderText).join("")}</h6>`;

    case "unordered-list":
      return `<ul>${contentItem.content
        .map((li) => renderListItem(li))
        .join("")}</ul>`; // Render unordered list item content correctly

    case "ordered-list":
      return `<ol>${contentItem.content
        .map((li) => renderListItem(li))
        .join("")}</ol>`; // Render ordered list item content correctly

    case "blockquote":
      return `<blockquote>${contentItem.content
        .map(renderText)
        .join("")}</blockquote>`;

    case "hr":
      return `<hr />`;

    case "table":
      return renderTable(contentItem);

    case "embedded-asset-block":
      return `<img src="${contentItem.data.target.fields.file.url}" alt="${contentItem.data.target.fields.title}" />`;

    case "hyperlink":
      return `<a href="${
        contentItem.data.uri
      }" target="_blank">${contentItem.content.map(renderText).join("")}</a>`;

    default:
      return `<p>Unsupported content type: ${contentItem.nodeType}</p>`;
  }
}

// Function to handle rendering of list items
function renderListItem(listItem) {
  return `<li>${listItem.content.map(renderNestedContent).join("")}</li>`;
}

// Function to handle text and nested content inside list items
function renderNestedContent(contentItem) {
  if (contentItem.nodeType === "text") {
    return renderText(contentItem);
  } else {
    // Recursively render nested content (e.g., bold text, links, etc.)
    return renderBlogContent(contentItem);
  }
}

// Function to handle text formatting (bold, italic, underline, etc.)
function renderText(textNode) {
  if (textNode.marks) {
    let formattedText = textNode.value;

    // Apply marks (bold, italic, etc.)
    textNode.marks.forEach((mark) => {
      switch (mark.type) {
        case "bold":
          formattedText = `<strong>${formattedText}</strong>`;
          break;
        case "italic":
          formattedText = `<em>${formattedText}</em>`;
          break;
        case "underline":
          formattedText = `<u>${formattedText}</u>`;
          break;
        case "code":
          formattedText = `<code>${formattedText}</code>`;
          break;
        default:
          break;
      }
    });

    return formattedText;
  }

  return textNode.value;
}

// Function to render table content
function renderTable(contentItem) {
  const rows = contentItem.content.map((row) => {
    const rowContent = row.content
      .map((cell) => {
        const cellContent = cell.content.map(renderText).join(""); // Get the text inside each cell
        return `<td>${cellContent}</td>`;
      })
      .join("");
    return `<tr>${rowContent}</tr>`;
  });

  return `<table>${rows.join("")}</table>`;
}

// Call fetchBlogDetails function on page load
window.onload = fetchBlogDetails;

// Contentful client setup
const client = contentful.createClient({
  space: "70oa5nna50l4",
  accessToken: "ywUTrK54VVR6-N1L541z477fQsMIKbcbunz4bzY2lOo",
});
