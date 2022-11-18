import { displayMessage, displayAcceptMessage } from '../functions.js';
import AppUserApi from "../api/appUserApi.js";
import GroupApi from "../api/groupApi.js";

const fileInput = document.querySelector("input[type=file]");
fileInput.classList.add("editImage__input");
const formFields = document.querySelector(".editImageForm__fields");
formFields.innerHTML = `<input type="file" name="profile_pic" id="id_profile_pic" class="editImage__input">`;
const btnCancelLength = 10;
const btnSaveLength = 13;
const btnGroupLength = 16;

class LayoutManager{
    constructor(){
        this.userApi = new AppUserApi();
        this.groupApi = new GroupApi();
        this.friendsDiv = document.querySelector(".friends");
        this.groupsDiv = document.querySelector(".groups");
        this.currentUserId = Number(localStorage.getItem("currentUserId"));  
        this.userInfo = document.querySelector(".userInfo");
        this.currentGroupId = -1;
        this.friendFormWrapper = document.querySelector("#friendFormWrapper");
        this.friendFormContainer = document.querySelector("#friendFormContainer");
        this.editFriendsBtn = document.querySelector("#editFriendsBtn");
        this.hideFormBtn = document.querySelector(".hideFormBtn");
    }
    initInfoDiv = async () =>{
        const user = await this.userApi.readDetail(this.currentUserId)
        this.userInfo.innerHTML += `<div class="userImgDiv">
            <img src="static/img${user.profile_pic}" alt="" class="bigUserImage">
        </div>
        <h2 id="username">${user.username}</h2>`
    }
    friendDiv = (user) =>{
        return `<div class="friend">
    <div class="friendLink" id="friendLink${user.user}">
        <img src="static/img${user.profile_pic}" alt="" class="friendImage">
        <br>
        <small>${user.username}</small>
    </div>
</div>`;
    }
    memberDiv = (member, groupId) => {
        return `<div class="friendTile">
        <img src="static/img${member.profile_pic}" alt="" class="profileImg">
        <div class="memberUsername">${member.username}</div>
        <div></div>
    </div>
    `
    }
    basicGroupName = (group) => `<strong>${group.group_name}</strong> 
    <button class="groupNameEditBtn" title="Edit group" id="groupNameEditBtn${group.id}">
        <i class="fa-solid fa-pen-to-square"></i>
    </button>`
    buildMembersDiv = (members, groupId) => {
        return members.reduce((total,member)=> 
            total += this.memberDiv(member, groupId) 
        , "");
    }
    groupDivContent = (group,members, groupNameDiv) => {
        return `<div class="groupName">
        ${groupNameDiv}
    </div>
    <div class="members">
        ${this.buildMembersDiv(members, group.id)}
    </div>`
    }
    groupDiv = (group, members, groupNameDiv) =>{
        return `<div class="group" id="group${group.id}">
    ${this.groupDivContent(group,members, groupNameDiv)}
</div>`
    }
    editedGroupName = (group) =>{
        return `<input type="text" value="${group.group_name}" class="nameInput"/> 
        <button type="button" class="btn-submit" id="changeNameBtn${group.id}">save</button>
        <i class="fa-solid fa-door-open"  title="leave this group" class="leaveGroup${group.id}"></i>
        `
    }
    friendTileDiv = (friend) =>{
        return `<div class="friendTile">
        <img src="static/img${friend.profile_pic}" alt="" class="profileImg">
        <div class="memberUsername">${friend.username}</div>
        <input type="checkbox" name="" id="deleteFriend${friend.user}">
    </div>`
    }
    fillGroupsDiv = async () =>{
        this.groupsDiv.innerHTML = "<h2>Group manager</h2>";
        const mathingGroups = await this.groupApi
            .getUserGroups(this.currentUserId);
        for(let group of mathingGroups){
            let members = await this.groupApi.getGroupMembers(group.id);
            this.groupsDiv.innerHTML += this.groupDiv(group, members, this.basicGroupName(group));
        };
        this.addEditGroupEvents();
    }
    updateGroupDiv = async (editMode) =>{
        const groups = document.querySelectorAll(".group")
        let currentGroup;
        for(let group of groups){
            if(group.id.slice(5) == this.currentGroupId){
                currentGroup = group;
                break;
            }
        }
        const mathingGroup = await this.groupApi.readDetail(this.currentGroupId)
        const members = await this.groupApi.getGroupMembers(this.currentGroupId);
        let nameDiv =this.basicGroupName(mathingGroup)
        if(editMode)
            nameDiv = this.editedGroupName(mathingGroup)
        currentGroup.innerHTML = this.groupDivContent(mathingGroup, members, nameDiv);
        if(!editMode)
            this.addEditGroupEvents();
    }
    editMode = async (groupNames, groupNamesValues, btn, index) => {
        let groupName = groupNamesValues[index].innerText;
        const groupId = Number(btn.id.slice(btnGroupLength));
        if(this.currentGroupId !==-1)
            await this.updateGroupDiv(false);
        this.currentGroupId = groupId; 
        await this.updateGroupDiv(true);
        const saveBtn = document.querySelector(`#changeNameBtn${groupId}`);
        saveBtn.addEventListener("click", async ()  => {
            const btnId = Number(saveBtn.id.slice(btnSaveLength));
            this.currentGroupId = btnId;
            const nameInput = document.querySelector(".groupName input");
            groupName = nameInput.value;
            this.addEditGroupEvents();
            await this.changeGroupName(groupName, groupId);
            this.updateGroupDiv(false);
        });
    }
    addEditGroupEvents = () =>{
        const editBtns = document.querySelectorAll(".groupNameEditBtn");
        const groupNames = document.querySelectorAll(".groupName");
        const groupNamesValues = document.querySelectorAll(".groupName strong");
        editBtns.forEach((btn, index) =>{
            btn.addEventListener("click", async () =>{
                await this.editMode(groupNames, groupNamesValues,btn, index);
            });
        });
    }
    changeGroupName = async (groupName, id) => {
        const group = await this.groupApi.readDetail(id);
        group.group_name = groupName;
        await this.groupApi.update(group, id);
    }
    removeUserFromGroup = async (id) =>{
        await this.groupApi.removeGroupMember(this.currentGroupId,id);
        const user = await this.userApi.readDetail(id);
        displayMessage(`You have successfully removed user ${user.username} from your group`);
        this.updateGroupDiv(true);
    }
    removeEventFunction = async (btn) =>{
        displayAcceptMessage("Are you sure you want to remove this user from the group?");
        const subBtn = document.querySelector("#popupSubmit")
        const cancelBtn = document.querySelector("#popupCancel")
        const id = Number(btn.id.slice(btnCancelLength));
        try {
            const result = await this.waitForPopup(subBtn, cancelBtn);
            if(result === 1)
                await this.removeUserFromGroup(id);
        } catch (error) {}
    }
    addRemoveEvent = async () => {
        const removeBtns = document.querySelectorAll(".btn-cancel");
        removeBtns.forEach(btn =>{
            btn.addEventListener("click", async () =>{
                await this.removeEventFunction(btn);
            });
        });
    }
    fillFriendsDiv = async () =>{
        const friends = await this.userApi.getUserFriends(this.currentUserId);
        friends.forEach(friend => {
            this.friendsDiv.innerHTML += this.friendDiv(friend);
        });
    }
    fillFriendsForm = async () =>{
        const friends = await this.userApi.getUserFriends(this.currentUserId);
        friends.forEach(friend => {
            this.friendFormWrapper.innerHTML += this.friendTileDiv(friend);
        
        })
    }
    displayFriendForm = () =>{
        this.friendFormWrapper.classList.remove("friendFormWrapper-hidden")
        this.friendFormWrapper.classList.add("friendFormWrapper-active")
        this.friendFormContainer.style.display = 'block';
    }
    hideFriendForm = () =>{
        this.friendFormWrapper.classList.remove("friendFormWrapper-active")
        this.friendFormWrapper.classList.add("friendFormWrapper-hidden")
        setTimeout(() => {
            this.friendFormContainer.style.display = 'none';
        }, 1000)
    }
    init = async () => {
        await this.initInfoDiv();
        this.changeImgBtn = document.getElementsByClassName("fa-camera")[0];
        this.fileInput = document.querySelector(".editImage__input");
        this.imgBtn = document.getElementsByClassName("img-btn")[0];
        this.changeImgBtn.addEventListener("click", () =>{
            this.dsiplayFileInput();  
        })
        await this.fillFriendsDiv();
        await this.fillGroupsDiv();
        await this.fillFriendsForm();
        this.editFriendsBtn.addEventListener("click", () =>{
            this.displayFriendForm();
            
        })
        this.hideFormBtn.addEventListener("click", () =>{
            this.hideFriendForm();
        })
        
    }
    waitForPopup = (subBtn, cancelBtn) =>{
        const body = document.querySelector("body");
        const popup = document.querySelector(".popupMessage");
        return new Promise((resolve, reject) =>{        
            subBtn.addEventListener('click', () =>{
                body.removeChild(popup);
                resolve(1);
            })
            cancelBtn.addEventListener('click', () =>{
                body.removeChild(popup);
                reject();
            })
        })
    }
    dsiplayFileInput = () =>{
        this.fileInput.style.display = 'block';
        this.imgBtn.style.display = 'block';
        this.fileInput.classList.add("editImage__input-animated");
        this.imgBtn.classList.add("img-btn-animated");
    } 
}
const lm = new LayoutManager();
lm.init();
function showForm(){
    lm.displayFriendForm()
}
function hideForm() {
    lm.hideFriendForm()
}
window.showForm = showForm;
window.hideForm = hideForm;