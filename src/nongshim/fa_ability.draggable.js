import {Sortable} from '@shopify/draggable';
import * as _ from 'lodash';
import * as $ from 'jquery';
require('jsrender')($); // load JsRender as jQuery plugin


/**
 * service
 * @type
 */
const service = {
  // 인사직무 목록 조회
  selectHrJobList: async () => {
    // const res = await fetch('/admin/ability/jobmapping/selectHrJobListData.do');
    const res = await fetch('/assets/job_hr_data.json');
    return await res.json();
  },

  // 교육직무 목록 조회
  selectEduJobList: async () => {
    // const res = await fetch('/admin/ability/jobmapping/selectEduJobListData.do');
    const res = await fetch('/assets/job_edu_data.json');
    return await res.json();
  },

  // 교육-인사직무 매핑 목록 조회
  selectEduHrJobMappingList: async () => {
    const res = await fetch('/admin/ability/jobmapping/selectEduHrJobMappingList.do');
    return await res.json();
  },

  // 교육직무 등록
  insertEduJob: async (eduJobNm) => {
    const param = {
      p_eduClassnm: eduJobNm
    };
    const res = await fetch('/admin/ability/jobmapping/insertEduJob.do', param);
    return await res.json();
  },

  // 교육직무 삭제
  deleteEduJob: async (eduJobId) => {
    const param = {
      p_eduJikclass: eduJobId
    };
    const res = await fetch('/admin/ability/jobmapping/deleteEduJob.do', param);
    return await res.json();
  },

  // 교육-인사직무 매핑
  mapEduHrJob: async (eduJobId, hrCompCd, hrJobId) => {
    const param = {
      p_eduJikclass: eduJobId,
      p_comp: hrCompCd,
      p_hrdJikclass: hrJobId
    };
    const res = await fetch('/admin/ability/jobmapping/insertEduHrJobMapping.do', param);
    return await res.json();
  },


  // 교육-인사직무 매핑 제거
  disconnectEduHrJob: async (eduJobId, hrCompCd, hrJobId) => {
    const param = {
      p_eduJikclass: eduJobId,
      p_comp: hrCompCd,
      p_hrdJikclass: hrJobId
    };
    const res = await fetch('/admin/ability/jobmapping/deleteEduHrJobMapping.do', param);
    return await res.json();
  },

}


let hrJobList = [], eduJobList = [];
let sortable;

// rendering data
const render = () => {
  console.log('render data'); // TODO debug log
}

// initialize drag&drop
const initDraggable = () => {
  sortable = new Sortable(document.querySelectorAll('.sortable'), {
    draggable: '.draggable',
    mirror: {
      constrainDimensions: true
    }
  });

  // TODO debug log
  sortable.on('drag:start', (e) => {console.log('drag:start', e)});
  sortable.on('sortable:sort', (e) => {console.log('sortable:sort', e)});
  sortable.on('sortable:sorted', (e) => {console.log('sortable:sorted', e)});

  sortable.on('drag:stop', (e) => {
    console.log('drag:stop', e); // TODO debug log
    // 교육-인사직무 매핑
    evt.mapEduHrJob(e.source.dataset, e.source.parentNode.parentNode.parentNode.dataset);
  });
};

const evt = {

  /**
   * 신규 교육직무 [등록]btn
   */
  newEduJob: () => {
    console.log('newEduJob'); // TODO debug log

    var newJobNm = $('#newEduJob').val();
    if (!newJobNm) {
      console.log('new job name required!!');
      return;
    }

    // duplicate validation
    if (_.some(eduJobList, {eduClassnm: newJobNm})) {
      console.log(`duplicated name for ${newJobNm}`);
      return;
    }

    const newJob = {
      eduJikclass: Math.floor(Math.random() * 100) + 1, // 1 to 1000
      eduClassnm: newJobNm
    };

    // 신규 교육직무 추가
    appendEduJob(newJob);
  },

  /**
   * 교육직무 [삭제]btn
   */
  deleteEduJob: () => {

  },

  /**
   * 교육-인사직무 [X]btn (연결해제)
   */
  disconnectEduHrJob: () => {

  },

  /**
   * 인사직무 drop to 교육직무
   * 교육-인사직무 매핑
   * add to [data, DB]
   * @param hr
   * @param edu
   */
  mapEduHrJob: (hr, edu) => {
    console.log('mapEduHrJob', edu, hr); // TODO debug log

    // add to data
    const eduJob = _.find(eduJobList, edu);
    if (!eduJob.hrJobs) {
      eduJob.hrJobs = [];
    }
    eduJob.hrJobs.push(hr);
    console.log('after map', eduJobList);
  },
};


const bindEvents = () => {
  // 신규 교육직무 [등록]btn
  $('#newEduJobBtn').click(evt.newEduJob);

  // 교육직무 [삭제]btn
  $('.edu-job-delete-btn').click(evt.deleteEduJob);

  // 교육-인사직무 [X]btn (연결해제)
  $('.disconnect-btn').click(evt.disconnectEduHrJob);
};


/**
 * 신규 교육직무 추가
 * add to [data, dom element, DB]
 * @param job
 */
const appendEduJob = (job) => {
  console.log('appendEduJob', job); // TODO debug log

  // append to data
  eduJobList.push(job);

  console.log(eduJobList); // TODO debug log

  // append to dom element
  const tmpl = $.templates('#eduJobTmpl');
  $('tbody#eduJobList').append(tmpl.render(job));

  // apply drag&drop!!
  sortable.addContainer($('tbody#eduJobList tr:last-child ul.sortable')[0]);
};




// load data
(async () => {
  hrJobList = await service.selectHrJobList();
  eduJobList = await service.selectEduJobList();

  console.log(hrJobList, eduJobList);

  // render datas
  render();

  // initialize drag&drop
  initDraggable();

  bindEvents();
})();

