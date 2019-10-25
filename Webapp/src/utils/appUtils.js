class Utils {

    /**
     * 获取用户级别
     * @returns -1 (游客), 0 (普通会员)，1 (VIP会员) 2 (钻石会员)
     */
    static getUserType = () => {
        let level = sessionStorage.getItem("userLevel");
        if (level) {
            level = Number.parseInt(level);
            if(level == -1) {
                level = -1;
            }else if (level == 1) {
                level = 0;
            } else {
                level = Math.floor((level - 2) / 3) + 1;
            }
        } else {
            level = 0;
        }
        return level;
    }

    /**
     * 获取用户会员年限
     * @returns 1 (1年) 2 (2年) 3 (3年)
     */
    static getUserVIPYear = () => {
        let value = sessionStorage.getItem("userLevel");
        let level = 0;
        if (value) {
            level = Number.parseInt(value)
            if (level == 1) {
                level = 0;
            } else {
                level = Math.floor((level - 2) % 3) + 1;
            }
        } else {
            level = 0;
        }
        return level;
    }

    /**
     * 判断vip时间，是否已到期
     * @returns true (vip未过期) false (vip已到期)
     */
    static isValid = () => {
        let userData = sessionStorage.getItem("userinfo");
        if (userData) {
            userData = JSON.parse(userData);
            let data = userData.data;
            if (data) {
                let userType = Utils.getUserType();
                let dateTime = new Date().getTime();
                if (userType == 1) {
                    return data.vipEndDate > dateTime;
                } else if (userType == 2) {
                    return data.diamondEndDate > dateTime;
                }
            }
        }
        return false;
    }

    static isUser = () => {
        let userData = sessionStorage.getItem("userinfo");
        return !!userData;
    }

    static utfToUniCode = (data) =>
    {
        // console.log('before turn: ', text);
        // text = escape(text.toString()).replace(/\+/g, "%2B");
        // let matches = text.match(/(%([0-9A-F]{2}))/gi);
        // if (matches)
        // {
        //     for (let matchid = 0; matchid < matches.length; matchid++)
        //     {
        //         let code = matches[matchid].substring(1,3);
        //         if (parseInt(code, 16) >= 128)
        //         {
        //             text = text.replace(matches[matchid], '%u00' + code);
        //         }
        //     }
        // }
        // text = text.replace('%25', '%u0025');
        // console.log('before turn after: ', text);
        // return text;
        // console.log('before turn b: ', data);
        let str ='';
        for(let i=0;i<data.length;i++)
        {
            str+="%u"+parseInt(data[i].charCodeAt(0),10).toString(16);
        }
        // console.log('before turn a: ', str);
        return str;
    }

}

export default Utils;