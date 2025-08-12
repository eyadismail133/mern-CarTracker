import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String },
  phone: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  attendance: [
    {
      date: { type: Date, default: Date.now },
      status: { type: String, enum: ["present", "absent"], required: true },
    },
  ],
});

employeeSchema.set("toObject", { virtuals: true });
employeeSchema.set("toJSON", { virtuals: true });

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
