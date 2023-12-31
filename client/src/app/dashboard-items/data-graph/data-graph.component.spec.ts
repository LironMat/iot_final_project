import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGraphComponent } from './data-graph.component';

describe('DataGraphComponent', () => {
  let component: DataGraphComponent;
  let fixture: ComponentFixture<DataGraphComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataGraphComponent]
    });
    fixture = TestBed.createComponent(DataGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
