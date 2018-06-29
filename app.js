// Storage Controller
const StorageCtrl = (function(){
  
  // Public Methods
  return {
    storeItem: function(item){
      let items;
      // Check if any items in LS
      if (window.localStorage.getItem('items') === null) {
        items = [];
        items.push(item);
        window.localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(window.localStorage.getItem('items'));
        items.push(item);
        window.localStorage.setItem('items', JSON.stringify(items));
      }
    },
    
    getItemsFromStorage: function(){
      let items;
      // Check if any items in LS
      if (window.localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(window.localStorage.getItem('items'));
      }
      return items;
    },
    
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(window.localStorage.getItem('items'));
      items.forEach(function(item, index){
        if (item.id === updatedItem.id) {
          items.splice(index, 1, updatedItem);
          window.localStorage.setItem('items', JSON.stringify(items));
        }
      });
    },
    
    deleteItemFromStorage: function(id){
      let items = JSON.parse(window.localStorage.getItem('items'));
      items.forEach(function(item, index){
        if (item.id === id) {
          items.splice(index, 1);
          window.localStorage.setItem('items', JSON.stringify(items));
        }
      });
    },
    
    clearItemsFromStorage: function(){
      window.localStorage.removeItem('items');
    }
  };
})();



// Item Controller
const ItemCtrl = (function(){
  
  // item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  
  // data structure
  const data = {
    // items: [
    // // {id:0, name: 'ステーキ', calories: 1200},  
    // // {id:1, name: 'クッキー', calories: 400},  
    // // {id:2, name: 'スクランブルエッグ', calories: 300}
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };
  
  // Public Methods
  return {
    getItems: function(){
      return data.items;
    },
    
    addItem: function(name, calories){
      
      // Create new id
      let ID;
      
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      
      calories = parseInt(calories, 10);
      
      // Create new item
      const newItem = new Item(ID, name, calories);
      
      data.items.push(newItem);
      
      return newItem;
    },
    
    deleteItem: function(id){
      // const items = Array.from(data.items);
      data.items.forEach(function(item, index){
        if (item.id === id) {
          data.items.splice(index, 1);
        }
      });
    },
    
    getItemById: function(id){
      let found = null;
      // Loop through items
      data.items.forEach(function(item){
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    
    updateItem: function(name, calorie){
      calorie = parseInt(calorie, 10);
      let found = null;
      
      data.items.forEach(function(item){
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calorie;
          found = item;
        }
      });
      return found;
    },
    
    clearAllItems: function(){
      data.items = [];
    },
    
    getCurrentItem: function(){
      return data.currentItem;
    },
    
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    
    getTotalCalories: function(){
      let total = 0;
      
      // Loop through items and add cals
      data.items.forEach(function(item){
        total += item.calories;
      });
      
      data.totalCalories = total;
      
      return data.totalCalories;
    },
    
    logData: function(){
      return data;
    }
  };
  
})();



// UI Controller
const UICtrl = (function(){
  
  const UISelectors = {
    addBtn: '.add-btn',
    editBtn: '.fa.fa-pencil.edit-item.pink-text.text-darken-2',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    itemList: '#item-list',
    listItems: '#item-list li',
    totalCalories: '.total-calories.pink-text'
  };
  
  // Public Methods
  return {
    populateItemList: function(items){
      let html = '';
      items.forEach(function(item){
        html += `
          <li class="collection-item" id="item-${item.id}">
            <strong>${item.name}:</strong> ${item.calories} <em>kcal</em>
            <a href="#!" class="secondary-content"><i class="fa fa-pencil edit-item pink-text text-darken-2"></i></a>
          </li>
        `;
      });
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    
    addListItem: function(item){
      
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      
      let html = `
        <li class="collection-item" id="item-${item.id}">
          <strong>${item.name}:</strong> ${item.calories} <em>kcal</em>
          <a href="#!" class="secondary-content"><i class="fa fa-pencil edit-item pink-text text-darken-2"></i></a>
        </li>
      `;
      
      // Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentHTML('beforeend', html);
    },
    
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      const itemID = `item-${item.id}`;
      
      listItems.forEach(function(listItem){
        if (listItem.id === itemID) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <strong>${item.name}:</strong> ${item.calories} <em>kcal</em>
            <a href="#!" class="secondary-content"><i class="fa fa-pencil edit-item pink-text text-darken-2"></i></a>
          `;
        }
      });
    },
    
    deleteListItem: function(id){
      let listItems = document.querySelectorAll(UISelectors.listItems);
      listItems = Array.from(listItems);
      const itemID = `item-${id}`;
      
      listItems.forEach(function(listItem){
        if (listItem.id === itemID) {
          document.querySelector(`#${itemID}`).remove();
        }
      });
      
      if (listItems.length === 1) {
        UICtrl.hideList();
      }
    },
    
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list into array
      listItems = Array.from(listItems);
      
      listItems.forEach(listItem => listItem.remove());
      
      UICtrl.hideList();

    },
    
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    
    addItemToForm: function(item){
      document.querySelector(UISelectors.itemNameInput).value = item.name;
      document.querySelector(UISelectors.itemCaloriesInput).value = item.calories;
      UICtrl.showEditState();
    },
    
    showTotalCalories: function(calories){
      document.querySelector(UISelectors.totalCalories).textContent = calories;
    },
    
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    
    showEditState: function(){
      document.querySelector(UISelectors.addBtn).style.display = 'none';
      document.querySelector(UISelectors.updateBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.backBtn).style.display = 'inline-block';
    },
    
    clearEditState: function(){
      UICtrl.clearInput();
      document.querySelector(UISelectors.addBtn).style.display = 'inline-block';
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    
    getSelectors: function(){
      return UISelectors;
    }
  };
})();



// App
const App = (function(StorageCtrl, ItemCtrl, UICtrl){
  // load event listeners
  const loadEventListeners = function(){
    
    // Get UISelectors
    const UISelectors = UICtrl.getSelectors();
    
    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });
    
    // Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    // Update item event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);
    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', itemBackSubmit);
    // Clear button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
  };
  
  // Add item submit
  const itemAddSubmit = function(e){
    
    // Get form input from UI controller
    const input = UICtrl.getItemInput();
    
    // Check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      
      // Add item to UI list
      UICtrl.addListItem(newItem);
      
      // Get total calorie
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      
      // Store in LS
      StorageCtrl.storeItem(newItem);
      
      // Clear input
      UICtrl.clearInput();
    }
    
    e.preventDefault();
  };
  
  // Click edit item
  const itemEditClick = function(e){
    
    if (e.target.classList.contains('edit-item')) {
      // Get list item id 
      const listID = e.target.parentNode.parentNode.id;
      // Break into an array
      const listIdArr = listID.split('-');
      // Get the actual id
      const id = parseInt(listIdArr[1],10);
      
      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      
      // Add item to form
      UICtrl.addItemToForm(itemToEdit);
    }
    
    
    e.preventDefault();
  };
  
  // Update item submit
  const itemUpdateSubmit = function(e){
    
    // Get item input
    const input = UICtrl.getItemInput();
    
    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    
    // Update UI
    UICtrl.updateListItem(updatedItem);
    
    // Get total calorie
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    
    // Update localStorage
    StorageCtrl.updateItemStorage(updatedItem);
    
    UICtrl.clearEditState();
      
    e.preventDefault();
  };
  
  // Delete item submit
  const itemDeleteSubmit = function(e){
    
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();
    
    // Delete data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);
    
    // Get total calorie
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    
    // Delete from localStorage
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    
    UICtrl.clearEditState();
    
    e.preventDefault();
  };
  
  // Back item submit
  const itemBackSubmit = function(e){
    UICtrl.clearEditState();
    
    e.preventDefault();
  };
  
  // Clear item event
  const clearAllItemsClick = function(e){
    
    // Confirm to clear all items
    if (confirm('全てのデータを削除しますか？')) {
      
      // Delete all items from data structure
      ItemCtrl.clearAllItems();
      
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      
      // Remove from UI
      UICtrl.removeItems();
      
      // Clear from localStorage
      StorageCtrl.clearItemsFromStorage();
    }
    
    e.preventDefault();
  };
  
  
  // Public Methods
  return {
    init: function(){
      const items = ItemCtrl.getItems();
      
      if (items.length > 0) {
        UICtrl.populateItemList(items);
      } else {
        UICtrl.hideList();
      }
      
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      
      // Load event listeners
      loadEventListeners();
    }
  };
  
})(StorageCtrl, ItemCtrl, UICtrl);

App.init();
