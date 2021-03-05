/*
References: Here is a list of the resources I referenced while developing this project.
https://regex101.com/ - Useful tool I used to test my regular expressions for my tokens.
*/

//Import Objects and css
import './public/css/mackComp';
const inputForm : HTMLFormElement = document.querySelector('#input');

inputForm.onsubmit = () => {
    const formData = new FormData(inputForm);
    console.log(formData)
    const text = formData.get('textInput') as string;
    console.log(text);
    return false;
};