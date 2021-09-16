"use strict";

class Node {
    constructor({ name, path, count }) {
        this.name = name;
        this.path = path;
        this.count = count;
        this.children = new Map();
    }

    addChild({ name, count, path }) {
        const newNode = new Node({ name, count, path });
        this.children.set(name, newNode);
    }
}

/**
 * Represents list of trees
 */
class TreeLists {
    constructor({ delimiter, mainContainer, array }) {
        this.delimiter = delimiter;
        this.mainContainer = mainContainer;
        this.trees = new Map();
        this.activated = null;
        this.#initializeTree(array);

        this.mainContainer.addEventListener("click", (e) =>
            this.#loggingAndActivating(e)
        );
    }

    /**
     * Creates and appends the lists to the mainContainer
     */
    appendListsToDOM() {
        this.trees.forEach((tree) => {
            let rootList = document.createElement("ul");
            let rootListItem = this.#createListItem(tree);
            rootListItem.appendChild(this.#recursiveListCreate(tree));
            rootList.appendChild(rootListItem);

            this.mainContainer.appendChild(rootList);
        });
    }

    /**
     * Creating a map of Nodes
     * @param array given input array
     */
    #initializeTree(array) {
        for (const item of array) {
            let route = this.#splitName(item.name);
            if (route.length === 1) {
                this.trees.set(
                    item.name,
                    new Node({
                        count: item.count,
                        name: route[0],
                        path: item.name,
                    })
                );
            } else {
                let node = this.#findNodeParentByRoute(route);
                node.addChild({
                    count: item.count,
                    name: route[route.length - 1],
                    path: item.name,
                });
            }
        }
    }

    #splitName(name) {
        return name.split(this.delimiter);
    }

    /**
     * Finding a node by route
     * @param {string[]} route the route to the node
     * @returns {Node} Found Node object
     */
    #findNodeParentByRoute(route) {
        let tree = this.trees.get(route[0]);

        for (let i = 1; i < route.length - 1; i++) {
            tree = tree.children.get(route[i]);
        }
        return tree;
    }

    /**
     * Creates a list item with text, and adds a click event to the text
     * @param {Node} node
     * @returns li component
     */
    #createListItem(node) {
        var li = document.createElement("li");
        li.id = node.path;
        var text = document.createElement("span");
        text.innerText = `${node.name} (${node.count})`;
        li.appendChild(text);
        return li;
    }

    /**
     * Creating a unordered list from a tree object
     * @param {Node} node
     * @returns a list component
     */
    #recursiveListCreate(node) {
        var list = document.createElement("ul");
        node.children.forEach((child) => {
            let li = this.#createListItem(child);
            li.appendChild(this.#recursiveListCreate(child));
            list.appendChild(li);
        });
        return list;
    }

    // Events

    /**
     * events: logging the full name, and activating/inactivating list items
     * @param {MouseEvent} e event
     */
    #loggingAndActivating(e) {
        if (e.target.tagName === "SPAN") {
            console.log(e.target.parentElement.id);
            if (this.activated) {
                if (this.activated === e.target) {
                    this.#inactivateListItem(this.activated);
                } else {
                    this.#inactivateListItem(this.activated);
                    this.#activateListItem(e.target);
                }
            } else {
                this.#activateListItem(e.target);
            }
        }
    }

    /**
     * Adding 'active' classname to event target and every parent
     */
    #activateListItem(target) {
        this.activated = target;
        let li = target.parentElement;
        li.className = "active";
        while (li.parentElement.parentElement != this.mainContainer) {
            li = li.parentElement.parentElement;
            li.firstChild.className = "active";
        }
    }

    /**
     * Deleting 'active' classname from any activated list item
     */
    #inactivateListItem(target) {
        this.activated = null;
        let li = target.parentElement;
        li.className = "";
        while (li.parentElement.parentElement != this.mainContainer) {
            li = li.parentElement.parentElement;
            li.firstChild.className = "";
        }
    }
}

(function () {
    const delimiter = "|";
    const mainContainer = document.getElementById("tree-container");

    const array = [
        {
            count: 38,
            name: "Lakberendezés, világítás, bútor",
        },
        {
            count: 37,
            name: "Lakberendezés, világítás, bútor|Bútor",
        },
        {
            count: 25,
            name: "Lakberendezés, világítás, bútor|Bútor|Nappali bútor",
        },
        {
            count: 10,
            name: "Lakberendezés, világítás, bútor|Bútor|Hálószoba bútor",
        },
        {
            count: 2,
            name: "Lakberendezés, világítás, bútor|Bútor|Ifjúsági bútor",
        },
        {
            count: 1,
            name: "Lakberendezés, világítás, bútor|Világítás",
        },
    ];

    const tree = new TreeLists({
        delimiter: delimiter,
        mainContainer: mainContainer,
        array: array,
    });
    tree.appendListsToDOM();
})();
