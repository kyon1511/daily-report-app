// src/lib/api/report.ts

import { fetcher } from '../fetcher';

export const fetchReportById = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`;
  return await fetcher(url);
};
