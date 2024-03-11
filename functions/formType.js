const Form = require('../models/Form');

const { getFormatDate } = require('../utils/common');

module.exports.formType = async () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() - 1);
    
    const forms = await Form.find({ form_type: { $exists:true }, view_date: getFormatDate(tomorrow)})

    for (let i = 0; i < forms.length; i++) {
        switch(forms[i].form_type) {
            case 'daily':
                forms[i].view_date.setDate(forms[i].view_date.getDate() + 1);
                await Form.updateOne({ _id: forms[i].id }, { view_date: forms[i].view_date})
                break;
            case 'weekly':
                forms[i].view_date.setDate(forms[i].view_date.getDate() + 7);
                await Form.updateOne({ _id: forms[i].id }, { view_date: forms[i].view_date})
                break;
            case 'monthly':
                forms[i].view_date.setDate(forms[i].view_date.getDate() + 30);
                await Form.updateOne({ _id: forms[i].id }, { view_date: forms[i].view_date})
                break;
            case 'biweekly':
                forms[i].view_date.setDate(forms[i].view_date.getDate() + 14);
                await Form.updateOne({ _id: forms[i].id }, { view_date: forms[i].view_date})
                break;
            default:
                console.log("not a valid view date");
        }
    }
}