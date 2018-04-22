import * as Clarifai from 'clarifai'; 

export class ClarifaiService {
    app = new Clarifai.App({
        apiKey: 'c439af974e7c43288355c3b18608b9c0'
    });
    obj = {
        foodResponse: {}, 
        foodNames: [],
        foodString: ''
    }

    constructor(){}

    foodPredict = async (imgURL) => {
        await this.app.models.predict("bd367be194cf45149e75f01d59f77ba7", imgURL).then(
            (response) => {
                let concepts = response.outputs[0].data.concepts
                this.obj.foodResponse = concepts;
                this.obj.foodString = `${concepts[0].name},${concepts[1].name},${concepts[2].name}`;
                for(let i = 0; i<3; i++){
                    this.obj.foodNames.push(concepts[i]);
                }
            },
            (err) => {
                console.log(err);
            }
        );
            return this.obj;

    }
}