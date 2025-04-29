function searchIngred(foodItem) {
  $(".results").empty();

  const queryURL = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(foodItem)}&app_id=0d9f7dae&app_key=d3398ede5f60b649e69bc8d26a3beab6`;

  fetch(queryURL)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      data.hits.forEach((hit) => {
        const recipe = hit.recipe;
        publishInfo(recipe.label, recipe.image, recipe.url);
      });
    })
    .catch(err => {
      console.error("Failed to fetch recipes:", err);
    });
}

function publishInfo(recipeTitle, recipeThumb, sourceLink) {
  const cleanId = recipeTitle.replace(/\s+/g, '');

  $("<div>").addClass("recipeTitle").attr("id", `${cleanId}recipeTitle`).appendTo(".results");
  $("<div>").addClass("thumbnail").attr("id", `${cleanId}thumbnail`).appendTo(".results");
  $("<div>").addClass("recipeLinks").attr("id", `${cleanId}recipeLinks`).appendTo(".results");

  innerDivs(recipeTitle, sourceLink);
  innerImg(recipeTitle, recipeThumb);
}

function innerDivs(recipeTitle, sourceLink) {
  const cleanId = recipeTitle.replace(/\s+/g, '');

  if (!$(`#h5${cleanId}`).length) {
    $("<h5>").text(recipeTitle).attr("id", `h5${cleanId}`).appendTo(`#${cleanId}recipeTitle`);
  }

  $("<a>")
    .html("<i class='fab fas fa-carrot'></i>")
    .attr({ href: sourceLink, target: "_blank" })
    .appendTo(`#${cleanId}recipeLinks`);
}

function innerImg(recipeTitle, recipeThumb) {
  const cleanId = recipeTitle.replace(/\s+/g, '');

  if (!$(`#img${cleanId}`).length) {
    $("<img>")
      .attr({
        src: recipeThumb,
        class: "thumbnailImg",
        id: `img${cleanId}`,
        alt: `Image of ${recipeTitle}`
      })
      .appendTo(`#${cleanId}thumbnail`);
  }
}