type TAction = {[key:string]: string}

export const makeActionCreator = (type: string, ...argNames: Array<string>): Function => (
    ...args: Array<any>
): TAction => {
    const action: TAction = { type };
    argNames.forEach((arg: string, index: number) => {
        action[arg] = args[index];
    });

    return action;
};

export default {
    makeActionCreator,
};