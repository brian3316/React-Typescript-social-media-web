export interface ITask {
    id: number | string;
    taskName: string | any;
    deadline: number | string | any;
    countdown?: number | string | any;
    complete?: boolean | any;
}

export interface MyCountDownTimer {
    days: number | string;
    hours: number | string;
    minutes: number | string;
    seconds: number | string;
}

export interface MySqlData {
    id: number | string;
    taskName: string;
    email: string;
    deadline: string | any;
    countdown: string | any;

}