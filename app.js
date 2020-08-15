var budgetController = (function () {

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var data = {
    allItems: {
      inc: [],
      exp: []
    },

    allTotals: {
      inc: 0,
      exp: 0
    },

    budget: 0,

    percentage: 0
  }

  var calculateTotal = function (type) {

    var sum = 0;

    data.allItems[type].forEach(function (current) {

      sum += current.value;

    });

    data.allTotals[type] = sum;

  }

  return {
    additem: function (type, des, val) {

      var ID, newItem;

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }


      if (type === "inc") {
        newItem = new Income(ID, des, val);
      } else if (type === "exp") {
        newItem = new Expense(ID, des, val);
      }

      data.allItems[type].push(newItem);
      return newItem;

    },

    calculateBudget: function () {

      calculateTotal("inc");
      calculateTotal("exp");

      data.budget = data.allTotals.inc - data.allTotals.exp;

      if (data.allTotals.inc > 0) {
        data.percentage = Math.round((data.allTotals.exp / data.allTotals.inc) * 100);
      } else {
        data.percentage = 0;
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalIncome: data.allTotals.inc,
        totalExpnse: data.allTotals.exp,
        percentage: data.percentage

      };

    },

    deleteItem: function (type, id) {

      var itemId, itemIndex;

      console.log(type, id)
      // console result in browser => income 0 => that means the code will try to run => data.allItems['income'].map and that is wrong as the names in data structure are inc and exp note income and expenses
      // that is happened because you are defining the id in DOM => income-0 , it should be inc-0 to match the name in the data structure

      itemId = data.allItems[type].map(function (current) {
        return current.id;
      });

      itemIndex = itemId.indexOf(id);

      if (itemIndex !== -1) {
        data.allItems[type].splice(itemIndex, 1);
      }

    },

    testing: function () {
      console.log(data);
    },


  };

})();


var uiController = (function () {

  var domString = {
    typeData: ".add__type",
    descriptionData: ".add__description",
    valueData: ".add__value",
    btnData: ".add__btn",
    incomeData: ".income__list",
    expenseData: ".expenses__list",
    budgetLebel: ".budget__value",
    totalIncomeLebel: ".budget__income--value",
    totalExpnseLebel: ".budget__expenses--value",
    percentageLebel: ".budget__expenses--percentage",
    container: ".container",

  }

  return {
    getInputData: function () {
      return {
        type: document.querySelector(domString.typeData).value,
        description: document.querySelector(domString.descriptionData).value,
        value: parseFloat(document.querySelector(domString.valueData).value)
      }

    },

    getDomString: function () {
      return domString;
    },

    addlistItem: function (obj, type) {
      var html, element, newHtml;

      if (type === "inc") {

        element = domString.incomeData;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {

        element = domString.expenseData;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

    },

    clearField: function () {
      var fields, fieldArr;

      fields = document.querySelectorAll(domString.descriptionData + "," + domString.valueData);
      fieldArr = Array.prototype.slice.call(fields);
      fieldArr.forEach(function (current) {
        current.value = "";
      });

    },

    displayBuget: function (obj) {
      document.querySelector(domString.budgetLebel).textContent = obj.budget;
      document.querySelector(domString.totalIncomeLebel).textContent = obj.totalIncome;
      document.querySelector(domString.totalExpnseLebel).textContent = obj.totalExpnse;

      if (obj.percentage > 0) {
        document.querySelector(domString.percentageLebel).textContent = obj.percentage + "%";
      } else {
        document.querySelector(domString.percentageLebel).textContent = "---";
      }

    },

  };

})();


var controller = (function (budgetCtrl, uiCtrl) {

  var ctrlAddItem = function () {

    var input = uiCtrl.getInputData();

    if (input.description !== "" && input.value !== 0 && !isNaN(input.value)) {
      var newItem = budgetCtrl.additem(input.type, input.description, input.value);
      uiCtrl.addlistItem(newItem, input.type);
      uiCtrl.clearField();
      budgetCtrl.calculateBudget();
      var budget = budgetCtrl.getBudget();
      uiCtrl.displayBuget(budget);

    }

  }

  var ctrlDeleteItem = function (event) {

    var itemID, itemSplit, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {

      itemSplit = itemID.split("-");
      type = itemSplit[0];
      ID = itemSplit[1];

      budgetCtrl.deleteItem(type, ID);

    }

  }

  var setupEventListener = function () {

    var Dom = uiCtrl.getDomString();
    document.querySelector(Dom.btnData).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (event) {
      if (event.keycode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(Dom.container).addEventListener("click", ctrlDeleteItem);

  };

  return {

    initialization: function () {

      console.log("Application has started");
      uiCtrl.displayBuget({
        budget: 0,
        totalIncome: 0,
        totalExpnse: 0,
        percentage: 0
      });
      setupEventListener();

    },

  };

})(budgetController, uiController);

controller.initialization();
