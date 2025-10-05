export const commonResponse = (
  success: boolean,
  message: string,
  data: any = null,
  status: number = 200
) => {
  return Response.json(
    {
      success,
      message,
      data,
      statuscode: status,
    },
    { status }
  );
};
