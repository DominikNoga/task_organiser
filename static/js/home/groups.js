import { fetchApi, displayMessage } from "../functions.js";
import { csrftoken as token } from "../messages/token.js";
export default class GroupManager{
    constructor(id){
        this.friendTilesDivUp = document.querySelectorAll(".friendTiles")[0];
        this.friendTilesDivDown = document.querySelectorAll(".friendTiles")[1];
        this.nameInput = document.querySelector(".createGroupForm input");
        this.namePar = document.querySelector(".groupName");
        this.currentGroup = [];
        this.currentUserId = id;
    }
    displayGroupTiles = async () =>{
        const urlAllUsers = "http://127.0.0.1:8000/task_api/app_users_list/"
        const urlCurrentUser = `http://127.0.0.1:8000/task_api/app_user_detail/${this.currentUserId}`
        const currentUser = await fetchApi(urlCurrentUser)
        const currentUserFriends = currentUser.friends;

        const allUsers = await fetchApi(urlAllUsers)
        const allFriends = allUsers.filter(friend => 
            currentUserFriends.includes(friend.user)
        )
        allFriends.forEach(friend => {
            this.friendTilesDivUp.innerHTML += 
                this.friendTileDiv(friend, "btn-submit", "Add")
        });
    }

    friendTileDiv = (friend, btnClass, btnText) =>{
        return `<div class="friendTile" id="friendTile${friend.user}">
    <img src="static/img${friend.profile_pic}" alt="" class="profileImg"/>
    ${friend.username} 
    <button class="${btnClass}" id="btnGroup${friend.user}">${btnText}</button>
</div>
        `
    }
    removeChosenElement(value){
        const index = this.currentGroup.indexOf(value);
        this.currentGroup.splice(index, 1);
    }
    replaceFriendTile = async (id, dir) =>{
        let divToRemove = this.friendTilesDivUp;
        let divToFill = this.friendTilesDivDown;
        let btnClass = "btn-cancel";
        let btnText = "Cancel";
        if(dir === "up"){
            divToRemove = this.friendTilesDivDown;
            divToFill = this.friendTilesDivUp;
            btnClass = "btn-submit";
            btnText = "Add";
        }
        const children = Array.from(divToRemove.childNodes).
        filter(child => child.nodeName === "DIV" );
        const childToRemove = children.find(child => 
           Number(child.id[child.id.length - 1]) === id
        );
        
        divToRemove.removeChild(childToRemove);
        
        const urlCurrentUser = `http://127.0.0.1:8000/task_api/app_user_detail/${id}`;
        const friendToMove = await fetchApi(urlCurrentUser);
        divToFill.innerHTML += this.friendTileDiv(friendToMove, btnClass, btnText);
        dir === "down" ? this.currentGroup.push(friendToMove) :
            this.removeChosenElement(friendToMove);
    } 
    initAddButtons = () =>{
       this.addButtons = document.querySelectorAll(".friendTile .btn-submit");
       for(let button of this.addButtons){
            let id = button.id[button.id.length - 1]
            button.addEventListener("click", async () =>{
                await this.replaceFriendTile(Number(id), "down");
                this.initCancelButtons();
            })
        }
    }
    initCancelButtons = () => {
        const cancelBtns = document.querySelectorAll(".friendTile .btn-cancel");
        cancelBtns.forEach(btn =>{
            let id = btn.id[btn.id.length - 1]
            btn.addEventListener("click", async () =>{
                await this.replaceFriendTile(Number(id), "up");
                this.initAddButtons();
            })
        })
    }
    createGroup = async () => {
        const createGroupUrl = "http://127.0.0.1:8000/task_api/create_group/";
        const members = this.currentGroup.map(user => user.user);
        members.push(this.currentUserId);
        const group = {group_name:this.nameInput.value, members: members}
        const options = {
            method: "POST",
            headers: {
                'Content-type':"application/json",
                'X-CSRFToken': token
            },
            body: JSON.stringify(group)
        };
        const request = await fetch(createGroupUrl, options);
        displayMessage("You have created a new group");
        this.friendTilesDivDown.innerHTML = "";
        this.friendTilesDivUp.innerHTML = "";
        this.nameInput.value = "";
        this.namePar.innerText = ""
        this.displayGroupTiles()
    }
    initAll = () => {
        this.nameInput.addEventListener("input", () => {
            this.namePar.innerText = "Group name:" + this.nameInput.value;
        }); 
        this.initAddButtons();
        const createGroupBtn = document.getElementById("createGroupBtn");
        createGroupBtn.addEventListener("click", async () => {
            if(this.nameInput.value ===""){
                displayMessage("Group name cannot be empty");
                return;
            }
            if(this.currentGroup.length < 1){
                displayMessage("Group must have at least one member");
                return;
            }
            await this.createGroup();
           
        })
    }
}