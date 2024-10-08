const clientextensions = {
    client: {
        $use(next){
            return async(params) => {
                console.log(`Query Model: ${params.model} , Action: ${params.action}`);
                const result = await next(params);
                console.log(`Query result: ${JSON.stringify(result)}`);
            };
        },
    },
};

export default clientextensions;