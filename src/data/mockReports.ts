import { ReportFormData } from '../components/ReportFormModal';

let reports: ReportFormData[] = [];

export const addReport = (report: ReportFormData) => {
  reports = [...reports, report];
  console.log('New report added:', report);
  return report;
};

export const getReports = () => {
  return reports;
};
