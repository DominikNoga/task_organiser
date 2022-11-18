import Api from "./api.js";
export default class AppUserApi extends Api {
    constructor (){
        super();
        this.listUrl = "http://127.0.0.1:8000/task_api/app_users_list/";
        this.detailUrl = `http://127.0.0.1:8000/task_api/app_user_detail/`
    }
    async read(){
        return super.read(this.listUrl);
    }
    async readDetail(id){
        return super.read(this.detailUrl + id);
    }
    async update(user, id) {
        const url = `http://127.0.0.1:8000/task_api/update_app_user/${id}`;
        await super.createOrUpdate(url, user, "POST");
    }
    getUserFriends = async (id) => {
        const allUsers = await this.read();
        const currentUser = await this.readDetail(id);
        return allUsers.filter(user =>
            currentUser.friends.includes(user.user)
        );
    }

}