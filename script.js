// script.js

function changeContent(title, imageUrl, content) {
  console.log("function call");
  document.getElementById("main-title").innerText = title;
  document.getElementById("main-content").innerText = content;
  document.getElementById(
    "healthcare"
  ).style.backgroundImage = `url(${imageUrl})`;
}

document.addEventListener("DOMContentLoaded", () => {
  const expertiseSelect = document.getElementById("expertise");

  expertiseSelect.addEventListener("change", (event) => {
    if (event.target.value === "all") {
      if (event.target.selectedOptions.length === 1) {
        // Select all options if "Select All" is the only selected option
        Array.from(event.target.options).forEach(
          (option) => (option.selected = true)
        );
      } else {
        // Deselect "Select All" if other options are selected
        event.target.options[0].selected = false;
      }
    } else {
      // Deselect "Select All" if other options are selected
      event.target.options[0].selected = false;
    }
  });
});

const client = contentful.createClient({
  space: "7rufusqf1lif",
  accessToken: "jSOOrRU7tKzvGkxKx2AHup0w9bnEuHsGEBqfJQ594bs",
});

// // Function to fetch and display data
// const fetchContent = async () => {
//   try {
//     // Fetch entries from Contentful using the client
//     const response = await client.getEntries();

//     // Log the entire response object to verify data
//     console.log("API Response:", response.items);

//     // Check if any items were fetched
//     if (response.items.length > 0) {
//       // Filter entries to include only 'Custody blog' content types
//       const blogEntries = response.items.filter(
//         (item) => item.sys.contentType.sys.id === "custodyBlog" // Adjusted to match correct Content Type ID
//       );

//       // Log filtered blog entries
//       console.log("blogEntries", blogEntries);

//       // Map over the entries and extract the desired data
//       const mappedData = blogEntries.map((entry) => {
//         const fields = entry.fields;

//         return {
//           blog_id: fields.blogId || "No ID available",
//           blog_thumbnail: fields.blogThumbnail?.fields?.file?.url
//             ? `https:${fields.blogThumbnail.fields.file.url}` // Properly format URL
//             : "No thumbnail available",
//           blog_title: fields.blogTitle || "No title available",
//           blog_tags: fields.blogTag || ["No tags available"],
//           blog_short_description:
//             fields.blogShortDescription || "No short description available",
//           blog_banner: fields.blogBanner?.fields?.file?.url
//             ? `https:${fields.blogBanner.fields.file.url}` // Properly format URL
//             : "No banner available",
//           blog_content:
//             fields.blogContent?.content
//               ?.map((content) => content.nodeType)
//               .join(", ") || "No content available",
//           blog_status: fields.blogStatus || "No status available",
//           author_name:
//             fields.authorName?.fields?.authorName || "No author name available",
//           author_image: fields.authorName?.fields?.authorImage1?.fields?.file
//             ?.url
//             ? `https:${fields.authorName.fields.authorImage1.fields.file.url}` // Properly format URL
//             : "No author image available",
//         };
//       });

//       // Clear any previous content
//       const blogGrid = document.querySelector("#content");
//       blogGrid.innerHTML = "";

//       // Insert the mapped data into the HTML
//       mappedData.forEach((item) => {
//         const blogItem = document.createElement("div");
//         blogItem.classList.add("w-dyn-item");

//         // Populate each blog item
//         blogItem.innerHTML = `
//   <div role="listitem" class="blog-item-2 w-dyn-item">
//     <div class="image-class">
//       <a href="#" class="blog-image-link w-inline-block">
//         <img
//           src="${item.blog_thumbnail}"
//           loading="lazy"
//           alt="Blog Thumbnail"
//           sizes="(max-width: 479px) 100vw, (max-width: 767px) 96vw, (max-width: 991px) 46vw, (max-width: 1279px) 30vw, (max-width: 1919px) 370px, 470px"
//           class="image-cover"
//         />
//       </a>
//     </div>
//     <div class="blog-content-wrapper">
//       <div class="data-categories-block">
//         <a href="#" class="label hover">${item.blog_tags.join(", ")}</a>
//         <div class="grey-text">${new Date().toLocaleDateString("en-US")}</div>
//       </div>
//       <a href="#" class="w-inline-block">
//         <h5 class="blog-post-title">${item.blog_title}</h5>
//       </a>
//       <p class="mb-30">${item.blog_short_description}</p>
//       <div class="author-section">
//         <img
//           src="${item.author_image}"
//           alt="Author Image"
//           class="author-image"
//           style=" "/>
//         <span class="author-name">${item.author_name}</span>
//       </div>
//       <a href="#" class="button-small green w-button">Read More</a>
//     </div>
//   </div>
// `;

//         console.log("Author Name: ", item.author_name);

//         blogGrid.appendChild(blogItem);
//       });
//     } else {
//       console.log("No content found.");
//     }
//   } catch (error) {
//     console.error("Error fetching content:", error);
//   }
// };

// // Call the fetchContent function
// window.onload = fetchContent();

// Function to store the blog_id in local storage and navigate to the blog details page
function setBlogId(blogId) {
  localStorage.setItem("blogID", blogId);
  window.location.href = "/blog-details.html"; // Redirect to blog details page
}

const fetchContent = async () => {
  try {
    // Fetch entries from Contentful using the client
    const response = await client.getEntries();

    // Log the entire response object to verify data
    console.log("API Response:", response.items);

    // Check if any items were fetched
    if (response.items.length > 0) {
      // Filter entries to include only 'Custody blog' content types
      const blogEntries = response.items.filter(
        (item) => item.sys.contentType.sys.id === "custodyBlog"
      );

      // Log filtered blog entries
      console.log("blogEntries", blogEntries);

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
            fields.blogShortDescription || "No short description available",
          author_name:
            fields.authorName?.fields?.authorName || "No author name available",
          author_image: fields.authorName?.fields?.authorImage1?.fields?.file
            ?.url
            ? `https:${fields.authorName.fields.authorImage1.fields.file.url}`
            : "No author image available",
        };
      });

      // Clear any previous content
      const blogGrid = document.querySelector("#content");
      blogGrid.innerHTML = "";

      // Insert the mapped data into the HTML
      mappedData.forEach((item) => {
        const blogItem = document.createElement("div");
        blogItem.classList.add("w-dyn-item");

        // Add onclick to store the blog ID in local storage
        blogItem.innerHTML = `
          <div role="listitem" class="blog-item-2 w-dyn-item">
            <div class="image-class">
              <a href="#" class="blog-image-link w-inline-block" onclick="setBlogId('${
                item.blog_id
              }')">
                <img
                  src="${item.blog_thumbnail}"
                  loading="lazy"
                  alt="Blog Thumbnail"
                  sizes="(max-width: 479px) 100vw, (max-width: 767px) 96vw, (max-width: 991px) 46vw, (max-width: 1279px) 30vw, (max-width: 1919px) 370px, 470px"
                  class="image-cover"
                />
              </a>
            </div>
            <div class="blog-content-wrapper">
              <div class="data-categories-block">
                <a href="#" class="label hover">${item.blog_tags.join(", ")}</a>
                <div class="grey-text">${new Date().toLocaleDateString(
                  "en-US"
                )}</div>
              </div>
              <a href="#" class="w-inline-block" onclick="setBlogId('${
                item.blog_id
              }')">
                <h5 class="blog-post-title">${item.blog_title}</h5>
              </a>
              <p class="mb-30">${item.blog_short_description}</p>
              <div class="author-section">
                <img 
                  src="${item.author_image}" 
                  alt="Author Image" 
                  class="author-image"
                  style="width: 50px; border-radius: 50%;" />
                <span class="author-name">${item.author_name}</span>
              </div>
              <a href="#" class="button-small green w-button" onclick="setBlogId('${
                item.blog_id
              }')">Read More</a>
            </div>
          </div>
        `;

        blogGrid.appendChild(blogItem);
      });
    } else {
      console.log("No content found.");
    }
  } catch (error) {
    console.error("Error fetching content:", error);
  }
};

// Call the fetchContent function
window.onload = fetchContent;
