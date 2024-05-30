$(function () {
    let detailScreen = {
        /**
         * 내부 전역변수
         *
         * @memberOf detailScreen
         */
        v: {
            masterSeq: '',
            contentType:'',
        },

        /**
         * 통신 객체- call
         *
         * @memberOf detailScreen
         */
        c: {
            /**
             * 교과서 리스트 조회
             *
             * @memberOf detailScreen.c
             */
			
			getCurriculumMappingCodeName: (param)=> {
				const options = {
					url: '/pages/api/mchive/getCurriculumMappingCodeName.ax',
					method: 'GET',
					data: param,
					success: function(res) {
						const $related = $('.related');
						//$related.empty();
					   
					   let relatedSub = "";
					   if(res.row.subjectName!= null && res.row.subjectName !=""){
							relatedSub += res.row.subjectName 
						}
						
						if(res.row.bigUnitNumber!= null && res.row.bigUnitNumber !=""){
							if(res.row.subjectName!= null && res.row.subjectName !=""){
								relatedSub += " 〉 " 
							}
							relatedSub += res.row.bigUnitNumber + ". "+ res.row.bigUnitName;
						}

                        if(res.row.middleUnitNumber!= null && res.row.middleUnitNumber !=""){
							
							if(res.row.middleUnitNumber!= null && res.row.middleUnitNumber !=""){
								relatedSub += " 〉 " 
							}
							
							relatedSub += res.row.middleUnitNumber + ". "+ res.row.middleUnitName;
						}
						
                        if(res.row.smallUnitNumber!= null && res.row.smallUnitNumber !=""){
							
							if(res.row.smallUnitNumber!= null && res.row.smallUnitNumber !=""){
								relatedSub += " 〉 " 
							}
							relatedSub += res.row.smallUnitNumber + ". "+res.row.smallUnitName;
						}
						
						
						if(res.row.subjectUnitName!= null && res.row.subjectUnitName !=""){
							if(res.row.subjectUnitName!= null && res.row.subjectUnitName !=""){
								relatedSub += " 〉 " 
							}
							
							if((res.row.startSubject!= null && res.row.startSubject !="") || (res.row.endSubject!= null && res.row.endSubject !="")){
							relatedSub += "["; 
							}
							
							
							if(res.row.startSubject!= null && res.row.startSubject !=""){
								relatedSub += res.row.startSubject;
							}
							
							if(res.row.endSubject!= null && res.row.endSubject !=""){
								if(res.row.endSubject!= null && res.row.endSubject !=""){
									relatedSub += " ~ " 
								}
								relatedSub += res.row.endSubject;
							}
							
							if((res.row.startSubject!= null && res.row.startSubject !="") || (res.row.endSubject!= null && res.row.endSubject !="")){
	
								relatedSub += "]차시 ";
							}
							
							relatedSub += res.row.subjectUnitName;
						}
						
						
					   let html = "";
					   html = `
			                    <li>
			                   		${relatedSub} 
			                    </li>
	                  `
	                  $related.append(html);

					}
				}
				$.ajax(options);
			},		   
		   
            getCurriculumMappingList: async ()=> {
				//console.info(masterSeq);
				let queryString = window.location.search;

                let searchParams = new URLSearchParams(queryString);
				console.info(searchParams.get('masterSeq'));
				console.info(searchParams.get('contentType'));

                detailScreen.v.masterSeq = searchParams.get('masterSeq');
                detailScreen.v.contentType = searchParams.get('contentType');
                console.log("masterSeq: ", detailScreen.v.masterSeq);
				
				const options = {
					url: '/pages/api/mchive/getCurriculumMappingList.ax',
					method: 'GET',
					data: {
						//masterSeq: masterSeq,
						masterSeq: detailScreen.v.masterSeq,
					},
					success: function(res) {
						const result = res.rows;
						console.info(result.length);
						
						if(result.length == 0) {
						   $(".combo-box").hide();
					    }
						
						result.map((data, idx)=> {
							const tempUUID = Math.random().toString(36).substring(2);
							console.log(data);
							//detailScreen.v.curriculumContent.push(Object.assign(data, {tempUUID: tempUUID}));
							detailScreen.c.getCurriculumMappingCodeName(Object.assign(data, {tempUUID: tempUUID}));
						});
						
					}
				};
				await $.ajax(options);
			},
        },

        /**
         * 내부 함수
         *
         * @memberOf detail
         */
        f: {
			
        },

        init: function (event) {
            detailScreen.c.getCurriculumMappingList();
        },
        event: function () {
        }
    }
    
   detailScreen.init();

});