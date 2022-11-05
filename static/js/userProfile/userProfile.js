import { displayMessage } from '../functions.js';
import AppUserApi from "../api/appUserApi.js";
import GroupApi from "../api/groupApi.js";
class LayoutManager{
    constructor(){
        this.userApi = new AppUserApi();
        this.groupApi = new GroupApi();
        this.friendsDiv = document.getElementById("friends");
        this.groupDiv = document.getElementById("groups");
        this.currentUserId = localStorage.getItem("currentUserId");  
        this.userInfo = document.getElementById("userInfo");
    }
    initInfoDiv = async () =>{
        const user = await this.userApi.readDetail(this.currentUserId)
        this.userInfo.innerHTML = `<img src="static/img${user.profile_pic}" alt="" class="bigUserImage">
        <h2 id="username">${user.username}</h2>`
    }
    friendDiv = (user) =>{
        console.log(user.profile_pic);
        return `<div class="friend">
    <div class="friendLink" id="friendLink${user.user}">
        <img src="static/img${user.profile_pic}" alt="" class="friendImage">
        <br>
        <small>${user.username}</small>
    </div>
</div>`;
    }
    groupDiv = (group) =>{

    }
    addFriendClickEvent = () =>{
        const links = document.querySelectorAll(".friendLink");
        links.forEach((link) =>{
            link.addEventListener("click", () =>{
                this.currentUserId = Number(link.id.slice(10));
                this.friendsDiv.innerHTML = "<h2 class='title'>Your friends</h2>";
                this.fillFriendsDiv(this.currentUserId);
                this.initInfoDiv();
            })
        });
    }
    fillFriendsDiv = async () =>{
        const allUsers = await this.userApi.read();
        const currentUser = await this.userApi.readDetail(this.currentUserId);
        const friends = allUsers.filter(user =>
            currentUser.friends.includes(user.user)
        );
        friends.forEach(friend => {
            this.friendsDiv.innerHTML += this.friendDiv(friend);
        });
        this.addFriendClickEvent();
    }
    init = async () => {
        this.initInfoDiv();
        this.fillFriendsDiv();
    }
}

const lm = new LayoutManager();
lm.init();