document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const addItemButton = document.getElementById("add-item");
    const groceryListTable = document.getElementById("grocery-list");

    // Initialize the grocery list from localStorage or use an empty array
    let allItems = JSON.parse(localStorage.getItem("items")) || [];

    // Function to create Edit button for a row
    function createEditButton(item, row) {
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");

        // const deleteButton = document.createElement("button");
        // deleteButton.textContent = "Delete";
        // deleteButton.classList.add("delete-button");

        editButton.addEventListener("click", function () {
            // Replace Edit button with Save button
            const saveButton = document.createElement("button");
            saveButton.textContent = "Save";
            saveButton.classList.add("save-button");

            // Create input fields for editing
            const nameEditInput = document.createElement("input");
            nameEditInput.value = item.name;

            const priceEditInput = document.createElement("input");
            priceEditInput.value = item.price;

            // Replace the content of the row with input fields and Save button
            row.innerHTML = `
                <td>${item.id}</td>
                <td><input type="text" class="edit-input" value="${item.name}"></td>
                <td><input type="number" class="edit-input" value="${item.price}"></td>
                <td><button class="save-button">Save</button><button class="delete-button">Delete</button></td>
            `;

            // Add event listener to the Save button
            row.querySelector(".save-button").addEventListener("click", function () {
                const inputFields = row.querySelectorAll("input.edit-input");

                const newName = inputFields[0].value;
                const newPrice = inputFields[1].value;

                if (newName === "" || isNaN(newPrice) || newPrice < 1) {
                    alert("Error! Please insert valid values!");
                } else {
                    // Update the item in the list
                    const updatedItem = {
                        id: item.id,
                        name: newName,
                        price: parseFloat(newPrice).toFixed(2),
                    };
                    allItems[item.id - 1] = updatedItem;

                    updateGroceryList();
                    // Update localStorage
                    localStorage.setItem("items", JSON.stringify(allItems));

                    // // Restore the row with updated values
                    // row.innerHTML = `
                    //     <td>${updatedItem.id}</td>
                    //     <td>${updatedItem.name}</td>
                    //     <td>${updatedItem.price}</td>
                    //     <td><button class="edit-button">Edit</button></td>
                    // `;

                    // // Add event listener to the Edit button in the restored row
                    // createEditButton(updatedItem, row);
                }
            });
        });

        return editButton;
    }

    function createDeleteButton(item, row){

        //Add Delete button to the row
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", function(){
            allItems = allItems.filter((itemFromList) => itemFromList.id !== item.id );
            // ovo zato sto pobrljavi id prilikom edita nakon brisanja
            allItems.forEach((item, index) => (item.id = index + 1));
            localStorage.setItem("items", JSON.stringify(allItems));
            console.log(JSON.stringify(allItems)+ "allItems");
            updateGroceryList();
        })

        return deleteButton;
    }

    // function deleteItemFromList(){

    // }


    // Function to update the grocery list in the UI
    function updateGroceryList() {
        groceryListTable.innerHTML = "";
        allItems.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td></td>
            `;

            // Add Edit button to the row
            const editButton = createEditButton(item, row);
            row.querySelector("td:last-child").appendChild(editButton);

            //Add Delete button to the row
            const deleteButton = createDeleteButton(item, row);
            row.querySelector("td:last-child").appendChild(deleteButton);

            groceryListTable.appendChild(row);
        });
    }

    // Function to add a new item to the grocery list
    function addItemToList(item) {
        allItems.push(item);
        localStorage.setItem("items", JSON.stringify(allItems));
        updateGroceryList();
    }

    // Add an event listener to the "Add item" button
    addItemButton.addEventListener("click", function () {
        const itemName = nameInput.value.trim();
        const itemPrice = parseFloat(priceInput.value);

        if (itemName === "" || isNaN(itemPrice) || itemPrice < 1) {
            alert("Error! Please insert valid values!");
        } else {

            // Find the last item in the list to determine the next ID
            const lastItem = allItems[allItems.length - 1];
            const nextId = lastItem ? lastItem.id + 1 : 1;

            const newItem = {
                id: nextId,
                name: itemName,
                price: itemPrice.toFixed(2),
            };
            addItemToList(newItem);

            // Clear input fields
            nameInput.value = "";
            priceInput.value = "1";
        }
    });

    // Initialize the grocery list in the UI
    updateGroceryList();
});