import { displayMessage } from "../functions.js";
import Api from "../api/api.js";
import GroupApi from "../api/groupApi.js";
import AppUserApi from "../api/appUserApi.js";
export default class GroupManager{
    constructor(){
        this.api = new Api();
        this.groupApi = new GroupApi();
        this.userApi = new AppUserApi();
        this.friendTilesDivUp = document.querySelectorAll(".friendTiles")[0];
        this.friendTilesDivDown = document.querySelectorAll(".friendTiles")[1];
        this.nameInput = document.querySelector(".createGroupForm input");
        this.namePar = document.querySelector(".groupName");
        this.currentGroup = [];
        this.currentUserId = Number(localStorage.getItem("currentUserId"));
    }
    displayGroupTiles = async () =>{
        const currentUser = await this.userApi.readDetail(this.currentUserId)
        const currentUserFriends = currentUser.friends;

        const allUsers = await this.userApi.read();
        const allFriends = allUsers.filter(friend => 
            currentUserFriends.includes(friend.user)
        )
        allFriends.forEach(friend => {
            this.friendTilesDivUp.innerHTML += 
                this.friendTileDiv(friend, "btn-submit", "Add")
        });
    }

    friendTileDiv = (friend, btnClass, btnText, animationClass) =>{
        return `<div class="friendTile ${animationClass}" id="friendTile${friend.user}">
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
        let animationClass = "tile-down";
        let btnText = "Cancel";
        if(dir === "up"){
            divToRemove = this.friendTilesDivDown;
            divToFill = this.friendTilesDivUp;
            btnClass = "btn-submit";
            animationClass = "tile-up";
            btnText = "Add";
        }
        const children = Array.from(divToRemove.childNodes).
        filter(child => child.nodeName === "DIV" );
        const childToRemove = children.find(child => 
           Number(child.id.slice(10)) === id
        );
        
        setTimeout(() =>{
            divToRemove.removeChild(childToRemove);
        },700)
        const friendToMove = await this.userApi.readDetail(id);
        divToFill.innerHTML += this.friendTileDiv(friendToMove, btnClass, btnText, animationClass);
        dir === "down" ? this.currentGroup.push(friendToMove) :
            this.removeChosenElement(friendToMove);
    } 
    initAddButtons = () =>{
       this.addButtons = document.querySelectorAll(".friendTile .btn-submit");
       for(let button of this.addButtons){
            let id = button.id.slice(8);
            button.addEventListener("click", async () =>{
                await this.replaceFriendTile(Number(id), "down");
                this.initCancelButtons();
            })
        }
    }
    initCancelButtons = () => {
        const cancelBtns = document.querySelectorAll(".friendTile .btn-cancel");
        cancelBtns.forEach(btn =>{
            let id = btn.id.slice(8);
            btn.addEventListener("click", async () =>{
                await this.replaceFriendTile(Number(id), "up");
                this.initAddButtons();
            })
        })
    }
    createGroup = async () => {
        const members = this.currentGroup.map(user => user.user);
        members.push(this.currentUserId);
        const group = {group_name:this.nameInput.value, members: members}
        await this.groupApi.create(group);
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