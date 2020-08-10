// TODO: budget-Controller.
var budgetController = (function() {

  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = 0;
  };

  Expense.prototype.calPercentage = function(totalIncome) {

    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = 0;
    }

  };

  Expense.prototype.getPercentage = function() {

    return this.percentage;

  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };


  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    total: {
      exp: 0,
      inc: 0
    },

    budget: 0,

    percentage: 0

  };

  var calculateTotal = function(type) {

    var sum = 0;

    data.allItems[type].forEach(function(current) {

      sum += current.value;
    });

    data.total[type] = sum;

  }

  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      // create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }


      // create new item based on "inc" or "exp" type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // push it our data structure
      data.allItems[type].push(newItem);
      return newItem;

    },

    deleteItem: function(type, id) {
      var ids, index;
      // id = 6.
      //data.allItems[type][id];
      // ids = [1 2 4 6 8]
      //index = 3

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

    },

    calculateBudget: function() {
      // calculate total(income, expenses).
      calculateTotal("exp");
      calculateTotal("inc");

      // calculate budget = total-inc. - total.exp.
      data.budget = data.total.inc - data.total.exp;

      // calculate the percentage of the income.
      if (data.total.inc > 0) {
        data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
      } else {
        data.percentage = 0;
      }

    },

    calculatePercentage: function() {

      /*
      Total Income = 100
      A = 20 .....percentage from Total Income = (20/100)*100 = 20%
      B = 10 .....percentage from Total Income =  (10/100)*100 = 10%
      C = 40 .....percentage from Total Income =  (40/100)*100 = 40%
       */

      data.allItems.exp.forEach(function(current) {

        current.calPercentage(data.total.inc);

      });

    },

    getPercentage: function() {

      var allPercen = data.allItems.exp.map(function(current) {
        return current.getPercentage();
      });

      return allPercen;

    },

    getBudget: function() {
      return {

        budget: data.budget,
        totalInc: data.total.inc,
        totalExp: data.total.exp,
        percentage: data.percentage

      };

    },

    testing: function() {
      console.log(data);
    }

  };


})();





// TODO:  UI Controller
var uiController = (function() {

  var domString = {
    typeData: ".add__type",
    descriptionData: ".add__description",
    valueData: ".add__value",
    buttonData: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensePercentageLebel: ".item__percentage"

  }
  return {

    getInputeData: function() {
      return {
        type: document.querySelector(domString.typeData).value,
        description: document.querySelector(domString.descriptionData).value,
        value: parseFloat(document.querySelector(domString.valueData).value)
      };

    },

    clearFilde: function() {
      var fields, fieldArr;
      fields = document.querySelectorAll(domString.descriptionData + ", " + domString.valueData);
      fieldArr = Array.prototype.slice.call(fields);
      fieldArr.forEach(function(current, index, array) {
        current.value = "";
      });
    },

    displayBudet: function(obj) {

      document.querySelector(domString.budgetLabel).textContent = obj.budget;
      document.querySelector(domString.incomeLabel).textContent = obj.totalInc;
      document.querySelector(domString.expensesLabel).textContent = obj.totalExp;
      document.querySelector(domString.percentageLabel).textContent = obj.percentage;

      if (obj.percentage > 0) {
        document.querySelector(domString.percentageLabel).textContent = obj.percentage + "%";
      } else {
        document.querySelector(domString.percentageLabel).textContent = "----";
      }

    },

    displayPercentage: function(percentage) {

      var fields = document.querySelectorAll(domString.expensePercentageLebel);

      var nodeListForEach = function(list, callback) {

        for (var i = 0; i < list.length; i++) {

          callback(list[i], i);

        }

      };

      nodeListForEach(fields, function(current, index) {

        if (percentage[index] > 0) {
          current.textContent = percentage[index] + "%";
        } else {
          current.textContent = "-----";
        }

      });

    },

    getDomString: function() {
      return domString;
    },

    addListItem: function(obj, type) {
      // create HTML string with placeholder text.
      var html, newHtml, element;

      if (type === "inc") {

        element = domString.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {

        element = domString.expenseContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace the place-holder text with actual data.
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

    },

    deleteListItem: function(selectorID) {
      var ele = document.getElementById(selectorID);
      ele.remove(ele);
    }

  };

})();







// TODO:  Global App. Controller
var controller = (function(budgetCtrl, uictrl) {

  var updateBudget = function() {

    // 01. calculate the budget.

    budgetCtrl.calculateBudget();

    // 02. Return to th budget.
    var budget = budgetCtrl.getBudget();

    // 03. Display the budget on UI.
    uictrl.displayBudet(budget);
  }

  var updatePercentage = function() {

    // calculate percentage for each item.
    budgetCtrl.calculatePercentage();

    // read the precentage from budget-Controller.
    var percentage = budgetCtrl.getPercentage();

    // update the percentage in UI.
    uictrl.displayPercentage(percentage);

  }

  var ctrlAddItem = function() {
    var input, newItem;
    // 01. Get the field inpute data.
    input = uictrl.getInputeData();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 02. Add the item to the budget controller.
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 03. Add the item to UI.
      uictrl.addListItem(newItem, input.type);

      // 04. clear the fields.
      uictrl.clearFilde();

      // 05. calculate and update the budget.
      updateBudget();

      //06. update and recalculate the percentage.
      updatePercentage();
    }

  }

  var ctrlDeleteItem = function(event) {

    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {

      // inc-0
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 01. delete the item from data structure.
      budgetCtrl.deleteItem(type, ID);

      // 02. delete the item from UI.
      uictrl.deleteListItem(itemID);

      //03. update and recalculate the budget.
      updateBudget();

      //04. update and recalculate the percentage.
      updatePercentage();

    }

  }

  var setupEventListener = function() {

    var dom = uictrl.getDomString();

    document.querySelector(dom.buttonData).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keycode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(dom.container).addEventListener("click", ctrlDeleteItem);

  }

  return {
    intial: function() {
      console.log("Application has started.");
      uictrl.displayBudet({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0
      });
      setupEventListener();
    }
  };

})(budgetController, uiController);

controller.intial();
