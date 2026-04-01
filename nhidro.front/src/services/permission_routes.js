import navigationConfig from "configs/navigationConfig";
import auth from "services/auth"

export const userHasPermissionRoute = (navLink) =>{

    let navigation = navigationConfig.find(navigation => navigation.navLink === navLink);

    if(navigation){
        
        const userInfo = auth.getUserInfo();
        let userHadPermission = navigation.permissions?.includes(userInfo?.role.name);
       
        if(userHadPermission){
            return true
        }
    }

    return false;
}