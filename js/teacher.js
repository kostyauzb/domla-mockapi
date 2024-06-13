const categoriesRow = document.querySelector(".categories-row");
const categoryForm = document.querySelector("#category-form");
const categoryModal = document.querySelector("#category-modal");
const categoryFormSubmitBtn = document.querySelector(
  "#category-form-submit-btn"
);
const showModalBtn = document.querySelector("#show-modal-btn");
const categorySearchInput = document.querySelector("#category-search-input");
const categoryQuantity = document.querySelector(".categories-quantity");
const categorySortSelect = document.querySelector("#category-sort-select");

let selected = null;
let search = "";
let categorySort = "";

function getCategoryCard({
  id,
  firstName,
  avatar,
  lastName,
  isMaried,
  phoneNumber,
  email,
}) {
  return `
    <div class="mb-3 col-lg-3 col-md-4 col-sm-6 col-12">
      <div class="card category-card">
        <img src=${avatar} class="card-img-top"  />
        <div class="card-body">
          <h6 class="card-title"> <span class="text-secondary">fullName:</span>  ${firstName}  ${lastName}</h6>
          <h6 class="card-title"> <span class="text-secondary">isMaried:</span>  ${isMaried}</h6>
          <h6 class="card-title"> <span class="text-secondary">phoneNumber:</span>   ${phoneNumber}</h6>
          <h6 class="card-title"> <span class="text-secondary" >email:</span>   ${email}</h6>
          <button 
            class='btn btn-warning'
            data-bs-toggle="modal"
            data-bs-target="#category-modal"
            onClick="editCategory(${id})"
          >
            Edit
          </button>
          <button 
            class='btn btn-danger'
            onClick="deleteCategory(${id})"
          >
            Delete
          </button>
          <a href="./student.html" class="btn btn-primary">See student</a>
        </div>
      </div>
    </div>
  `;
}

// Read
async function getCategories() {
  try {
    categoriesRow.innerHTML = "Loading...";

    // const params = { orderBy: 'createdAt', order: 'desc' };
    const [orderBy, order] = categorySort.split("-");
    const params = { firstName: search, orderBy, order };

    let { data } = await request.get("teachers", { params });

    categoryQuantity.textContent = data.length;
    categoriesRow.innerHTML = "";

    // mapping
    data.map((teachers) => {
      categoriesRow.innerHTML += getCategoryCard(teachers);
    });
  } catch (err) {
    console.log(err.response.data);
    categoriesRow.innerHTML = "Not found";
  }

  // finally {
  //   console.log("Work");
  // }
}

getCategories();

// Create and Update
categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstName = e.target.elements.firstName.value;
  const lastName = e.target.elements.lastName.value;
  const avatar = e.target.elements.avatar.value;
  const teacher = { firstName, lastName, avatar };

  if (selected === null) {
    await request.post("teachers", teacher);
  } else {
    await request.put(`teachers/${selected}`, teacher);
  }
  getCategories();
  bootstrap.Modal.getInstance(categoryModal).hide();
  categoryForm.reset();
});

async function editCategory(id) {
  let {
    data: { firstName, avatar },
  } = await request.get(`teachers/${id}`);
  categoryForm.elements.firstName.value = firstName;
  categoryForm.elements.lastName.value = lastName;
  categoryForm.elements.avatar.value = avatar;
  selected = id;
  categoryFormSubmitBtn.textContent = "Save";
}

showModalBtn.addEventListener("click", () => {
  selected = null;
  categoryForm.reset();
  categoryFormSubmitBtn.textContent = "Add";
});

// Delete
async function deleteCategory(id) {
  let isDeleted = confirm("Are you sure you want to delete this teacher ?");
  if (isDeleted) {
    await request.delete(`teachers/${id}`);
    getCategories();
  }
}

// Search
categorySearchInput.addEventListener("keyup", (e) => {
  search = e.target.value;
  getCategories();
});

// Sort
categorySortSelect.addEventListener("change", (e) => {
  categorySort = e.target.value;
  getCategories();
});
