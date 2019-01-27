/*
 *
 * @author : Jeason Laung
 * @date   : 2019/1/27
 * 
 */

/*
 *
 * 仿TP验证器的js验证器类
 *
 */
class validate{
	constructor(o=null,msg=null){
		if(o!==null){
			check(o,msg)
		}
	}
	//0未运行，1成功,2失败
	#status = 0
	//输出结果
	#res = null
	/*
	 * 
	 * 内置验证
	 *
	 */
	msg = {
		email:(n)=>'邮箱地址有误！',
		mobile:(n)=>'手机号有误！',
		ip:(n)=> 'ip地址非法！',
		num:(n)=>'只能为数字',
		numAlpha:(n)=>'只能存在字母及数字',
		numOrAlpha:(n)=>'只能存在字母或数字',

		require:(n)=>`${n}不能为空`,
		max:(n,max)=>`${n}不能超过${max}个字符`,
		min:(n,min)=>`${n}最少要${min}个字符`,
		len:(n,min,max)=>`${n}字符长度必须在${min}-${max}之间`,
		Reg:(n)=>`${n}不符合格式要求`,


		before:(v)=>`必须在${v}前`,
		after:(v)=>`必须在${v}后`,

		between:(v1,v2)=>`必须在${v1}至${v2}`
	}
	compare = {
		parse(str){
			if (/^\d+$/.test(str)) {
				return parseInt(str);
			}
			return str
		},
		before(setDate,getDate){
			console.log((new Date(this.parse(setDate))).getTime(),(new Date(this.parse(getDate))).getTime())
			return (new Date(this.parse(setDate))).getTime() > (new Date(this.parse(getDate))).getTime()
		},
		after(setDate,getDate){
			return (new Date(this.parse(setDate))).getTime() < (new Date(this.parse(getDate))).getTime()
		},
		between(beginDate,endDate,getDate){
			let getTime = (new Date(this.parse(getDate))).getTime();
			let beginTime = (new Date(this.parse(beginDate))).getTime();
			let endTime = (new Date(this.parse(endDate))).getTime();

			return getTime > beginTime && endDate > beginTime;
		}
	}
	re = {
		
		email: ()=>new RegExp('^[A-Za-z\\d]+([-_.][A-Za-z\\d]+)*@([A-Za-z\\d]+[-.])+[A-Za-z\\d]{2,4}$'),
		mobile:()=>new RegExp('^1[34578]\\d{9}$'),
		ip: ()=>new RegExp('((25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))\\.){3}(25[0-5]|2[0-4]\\d|((1\\d{2})|([1-9]?\\d)))'),
		num:()=>new RegExp('^\\d+$'),
		numAlpha:()=>new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])(.{1,})$'),
		numOrAlpha:()=>new RegExp('^[a-zA-Z0-9]{1,}$'),

		require:()=>new RegExp('.+'),
		max:(max)=>new RegExp(`^.{0,${max}}$`),
		min:(min)=>new RegExp(`^.{${min},}$`),
		len:(min,max)=>new RegExp(`^.{'+min+'}.{0,${max-min}}$`),
		Reg:(re)=>new RegExp(re),
	}

	/*
	 *
	 * Tool 工具函数
	 *
	 */

	/*
	 *
	 * 因Promise套进去之后报错(暂未知道原因)，自制promise
	 *
	 */
	then(func){
		if (this.#status === 1) {
			func(this.#res)
			this.#status = 0
			this.#res = null
		}
		return this
	}

	catch(func){
		if (this.#status === 2) {
			func(this.#res)
			this.#status = 0
			this.#res = null
		}
		return this
	}

	/*
	 *
	 * 操作函数
	 *
	 */
	check(data,msg=null){
		// data={"用户名|require":123456,"邮箱|require":456789}
		// msg={"用户名|require":"自定义消息"}
		// return Promise((resolve,reject)=>{
		let key,res;
		for(key in data){
			//分割名称
			let chips = key.split("|");
			//获取名称
			let name = chips[0];
			//获取验证规则
			let rules = chips[1].split('.');

			//获取这条数据
			let this_data = data[key];
			for (var i = 0; i < rules.length; i++) {
				//获取规则名称
				let re_name = rules[i].match(/(.+?)\((.*)\)/)[1];
				//获取规则参数
				let re_params = rules[i].match(/(.+?)\((.*)\)/)[2];

				//核心验证
				if (this.compare[re_name]) {
					// console.log(re_params,this_data)
					let params = re_params.split(",");
					res = this.compare[re_name](...params,this_data)
					re_params = params.map((v)=>`\"${v}\"`).join(",")
				}else{
					res = eval(`(this.re.${re_name}(${re_params})).test(\"${this_data}\")`);
				}

				if (res !== true) {
					//核心输出
					if (msg !== null) {
						if(undefined!==msg[name+"|"+re_name]){
							this.#res = msg[name+"|"+re_name];
						}else{
							this.#res = eval(`this.msg.${re_name}(\"${name}\",${re_params})`);
						}

					}
					//失败
					this.#status = 2
					return this;
				}
			}
		}
		//成功
		this.#status = 1
		this.#res = true
		return this;
	}
}

export default{
	validate
}
